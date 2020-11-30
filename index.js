const puppeteer = require('puppeteer');

(async () => {
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

  await browser.close();
})();

