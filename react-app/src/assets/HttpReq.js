function httpGet(theUrl){
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.open("GET", theUrl, false); 
    xmlHttp.send(null);
    if(xmlHttp.readyState == 4 && xmlHttp.status == 200){
        return xmlHttp.response
    }

}

module.exports={
    httpGet:httpGet,
}