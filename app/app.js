

const CC = require('./CoordConverter.js');
const coordConverter =  new CC();


const express = require('express');
const app = new express();
const sql = require('mssql'); //Libreria per la connessione al dbms MSSQL


// letture consigliate
// https://www.tutorialsteacher.com/nodejs/access-sql-server-in-nodejs

// 213.140.22.237.Katmai.
//Oggetto di connessione al DB
const config = {
    user: 'PCTO',
    password: 'xxx123#',
    server: "213.140.22.237",  //Stringa di connessione
    port: 1433,
    database: 'Katmai', //(Nome del DB)
}

app.get('/', function (httpReq, httpRes) {
    //connect è un metodo della libreria mssql che vuole due parametri: la stringa di
    //connessione e una funzione di callback
    sql.connect(config, (err) => {
        if (err) console.log(err);  // ... error check
        else makeSqlRequest(httpRes);    // Se la connessione va a buon fine esequo il metodo
    });
});


//makeSqlRequest esegue una query sul db, se la query va a buon fine viene richiamata la funzione di //callback che invoca il metodo sendQuery
function makeSqlRequest(httpRes) {
    let sqlRequest = new sql.Request(); //sqlRequest: oggetto che serve a eseguire le query
    let q = 'SELECT DISTINCT TOP (100) [GEOM].STAsText() FROM [Katmai].[dbo].[interventiMilano]';
    //eseguo la query e aspetto il risultato nella callback
    sqlRequest.query(q, (err, sqlResult) => { sendQueryResults(err, sqlResult, httpRes) });
}





function sendQueryResults(err,sqlResult, httpRes)
{
    console.log(sqlResult.recordset[0]);
    //  '': 'POLYGON ((516035.55555521825 5040991.6384293158, 516069.28490508086 5040978.2988269627, ... ))' }
    // formato WKT https://it.wikipedia.org/wiki/Well-Known_Text

    if (err) console.log(err); // ... error checks
    httpRes.send(coordConverter.generateGeoJson(sqlResult.recordset));  //Invio il risultato al Browser
}



//---------------------------
// Main
//---------------------------
app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
});

