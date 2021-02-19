const cheerio = require('cheerio');
const request = require('request-promise');

async function GetData(url) {

    let links = await getlinks(url).catch(err=>{console.log('LINK FUNC FAIL')})

    let resumes = await scrap(links).then(data=>{return data}).catch(err=>{console.log('SCRAP FUNC FAIL')})

    return await Promise.resolve(resumes)

}

async function scrap(links){
    let resumes = links.map(link=>{
        return  getAnimeDetails(link).catch(err=>{console.log('RESUME FUNC FAIL')})
    })
    return await Promise.all(resumes)
}

async function getlinks(url) {
    const $ = await request({
        uri: url,
        transform: body => cheerio.load(body)
    });

    let animes = []
    $('.Anime>a').each((index, anime) => {
        animes.push(`https://www3.animeflv.net/${$(anime).attr('href')}`)
    })

    return animes

}

async function getAnimeDetails(url) {
    let arr_gene = [];

    const $ = await request({
        uri: url,
        transform: body => cheerio.load(body)
    });

    $('.Nvgnrs>a').each((index, genere) => {
        arr_gene.push($(genere).text())
    })

    let resume = {
        url: url,
        title: $('h1.Title').text().replace("'", ' '),
        img: `https://www3.animeflv.net/${$('.AnimeCover>div>figure>img').attr('data-cfsrc')}`,
        synopsis: $('.Description>p').text(),
        status: $('.fa-tv').text(),
        generes: arr_gene
    }

    return resume

}



exports.GetData = GetData