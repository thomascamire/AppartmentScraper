const puppeteer = require('puppeteer');

async function scrapeKijiji() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  let links = [];
  let currentPage = 1;
  let URLStart = "https://www.kijiji.ca/b-appartement-condo/ville-de-quebec/6+1+2__6+1+2+et+coin+detente__7+1+2/page-";
  let URLEnd = "/c37l1700124a27949001?ll=46.811230%2C-71.216945&address=Ninkasi+Simple+Malt+Qu%C3%A9bec%2C+Rue+Saint-Jean%2C+Qu%C3%A9bec%2C+QC&ad=offering&radius=2.0&price=__2500";

  await page.goto(URLStart + String(currentPage) + URLEnd);

  const numberOfResults = await page.evaluate(() => {
    let content = document.querySelectorAll(".real-estate-title-wrapper .showing")[0].innerHTML;
    return Number(content.substring(content.length - 13, content.length).replace(/\D/g,''));
  });

  const numberOfPages = Math.ceil(numberOfResults/40);


  console.log("counted number of pages");

  for(; currentPage <= numberOfPages; currentPage++){

      if(currentPage != 1){
        await page.goto(URLStart + String(currentPage) + URLEnd);
      }

    let newLinks = await page.evaluate(() => {
        let allLinks = [];
        for (let i = 0; i < document.querySelectorAll(".search-item .title").length; i++){
            if(document.querySelectorAll(".search-item .title")[i].firstElementChild != null){
                allLinks.push(document.querySelectorAll(".search-item .title")[i].firstElementChild.getAttribute("href"));
            }
        }
        return allLinks;
    });

    links = links.concat(newLinks);
  }

  console.log("got " + String(links.length) + " links");

  let allInfos = [];

  const delay = time => new Promise(res=>setTimeout(res,time));

  for (let link of links){
      console.log("doing link " + link);
      await page.goto("https://www.kijiji.ca" + link);
      console.log("got to page, waiting...");
      await delay(5000);
      let infos = await page.evaluate(() => {
        let infos = {};
        if(document.querySelectorAll(".title-2323565163")[0] != undefined){
            infos["title"] = document.querySelectorAll(".title-2323565163")[0].innerHTML;
        }
        if(document.querySelectorAll(".address-3617944557")[0] != undefined){
            infos["address"] = document.querySelectorAll(".address-3617944557")[0].innerHTML;
        }
        if(document.querySelectorAll(".priceWrapper-1165431705")[0] != undefined){
            infos["price"] = document.querySelectorAll(".priceWrapper-1165431705")[0].firstElementChild.getAttribute("content");
        }
        return infos;
      });
      infos["link"] = "kijiji.ca" + link;
      allInfos.push(infos);
      console.log(infos);
  }

  console.log("got " + Number(allInfos.length) + " appartements");

  await browser.close();

  return allInfos;
}

module.exports = {scrapeKijiji}