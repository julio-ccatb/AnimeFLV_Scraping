
require('dotenv').config();
const db = require('./libs/mySql');
const Anime = require('./models/animes');
var AnimeFLV = require('./controllers/scrapingController');
var Page = process.argv[2]


console.log(`

DATABASE DETAILS

HOST:       ${process.env.DB_HOST}
USER:       ${process.env.DB_USER}
PASS:       ${process.env.DB_PASSWORD}
DATABASE:   ${process.env.DB_DATABASE}

`);


if (db) {
    AnimeFLV.GetData(`https://www3.animeflv.net/browse?page=${Page}`).then(data => {
        list = data.map(anime => {
            
            let new_Anime = new Anime(anime.url, anime.title, anime.img, anime.synopsis, anime.status, anime.generes);
            return new_Anime;
        })
        return list

    }).then((list) => {

        list.forEach(anime => {
            let sql = `INSERT INTO animes (url,title,img,synopsis,status) VALUES('${anime.url}', '${anime.title}', '${anime.img}', '${anime.synopsis}', '${anime.status}')`
            let id = null
            db.query(sql, '', (err, result) => {
                if (err) console.error(err);

                id = result.insertId


                anime.generes.forEach(genere => {
                    let sql_1 = `INSERT INTO animegeneres (animeid,genere) VALUES (${id},'${genere}')`
                    db.query(sql_1, (err, result) => {
                        if (err) console.error(err);
                        console.log(`

                ID:     ${id}
                Title:  ${anime.title} 
                
                Saved Correctly...`);
                    })
                });
            })
        });
    })
}