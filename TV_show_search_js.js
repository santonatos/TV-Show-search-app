const form = document.querySelector(".appContainerItem>#searchForm");
const searchBox = document.querySelector(".appContainerItem>#searchForm>.input");
//console.log(searchBox);
const searchResultsContainer = document.querySelector(".appContainerItem#searchResultsContainer");



const appAPI = {
    baseURL : "https://api.tvmaze.com",
    searchURL: "/search/shows?q=", //+query
    showInfo : "/shows/" //+id

};

const makeSearchURL = (query) =>{
    return appAPI.baseURL + appAPI.searchURL + query;
}

const sendGET = async (fullURL) => {
    console.log("Sending GET: ",fullURL);
    try{
       let res = await fetch(fullURL);
       let data = await res.json();
        //console.log("RESPONSE: ",data);
        return data;
    }catch (e){
        console.log(`ERROR SENDING GET REQUEST WITH URL ${$fullURL}`);
        console.log(e);
    }

}

const makeShowObj = (fullShowObj) =>{
    const name = fullShowObj.show.name;
    //console.log("converting",name);
    let img = "https://image.shutterstock.com/z/stock-vector-tv-series-neon-text-with-popcorn-bucket-in-armchair-home-cinema-and-entertainment-design-night-1339146254.jpg";
    if ((fullShowObj.show.image != null) && ('medium' in fullShowObj.show.image)){
        img = fullShowObj.show.image.medium;
    }
    let officialSite = "https://www.NOOFFICIALSITE."+name.replaceAll(' ','')+".com"
    if(fullShowObj.show.officialSite != null && (fullShowObj.show.officialSite.trim() !== "")){
        officialSite = fullShowObj.show.officialSite;
    }
    return {
        title:name,
        image: img,
        rating:fullShowObj.show.rating.average,
        link: fullShowObj.show.url,
        officialSite: officialSite,
        id: fullShowObj.show.id
    }
}

const makeShowObjArr = (fullShowArr) => {
    const showArr = [];
    for (let fullShow of fullShowArr){
        showArr.push(makeShowObj(fullShow))
    }
    return showArr;
}

const clearDisplayResults = ()=>{
    console.log("clearing display: ",searchResultsContainer.childElementCount)
    while(searchResultsContainer.hasChildNodes()){
        //console.log("removing elt");
        searchResultsContainer.removeChild(searchResultsContainer.lastChild);
    }

}

const makeShowDisplayContainer = (showObj) => {
    const newDiv = document.createElement("div");
    const newFig = document.createElement("figure");
    const newImg = document.createElement("img");
    const newFigCaption = document.createElement("figcaption");
    newImg.setAttribute("src",showObj.image);
    newImg.classList.add("image","is-128x128");
    newFigCaption.innerText = showObj.title;
    newFig.appendChild(newImg);
    newFig.appendChild(newFigCaption);
    newDiv.appendChild(newFig);
    newDiv.classList.add("rightMargin");
    //newDiv.classList.add("rowDisplay");

    console.log("new container",newDiv);
    searchResultsContainer.appendChild(newDiv);
}

const displayResults = (showArray) => {
    searchResultsContainer.classList.remove("hide");
    searchResultsContainer.classList.remove("flexRowDisplay");
    searchResultsContainer.classList.add("hide");
    //searchResultsContainer.classList.remove("rowDisplay");

    for (let show of showArray){
        console.log(show);
        makeShowDisplayContainer(show);
    }
    searchResultsContainer.classList.add("flexRowDisplay");
    //searchResultsContainer.classList.add("rowDisplay");


    searchResultsContainer.classList.remove("hide");
}




form.addEventListener("submit",function(e){
    e.preventDefault();
    console.log("SUBMITTED!");
    let searchQuery = searchBox.value;
    if(!searchQuery){
        alert("Enter a non-empty TV show name!")
    }else{
        clearDisplayResults();
        console.log(searchQuery);
        let sURL = makeSearchURL(searchQuery);
        sendGET(sURL).then((searchResult) => {
            console.log("searchResult:",searchResult);
            displayResults(makeShowObjArr(searchResult));
        }
        );
    }
    
})

