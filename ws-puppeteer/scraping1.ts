const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => { 
    const browser = await puppeteer.launch({ headless: false })
    const NewPage = await browser.newPage()
    await NewPage.goto("https://www.tematika.com/libros?limit=40&p=1")
    
    let res = await NewPage.evaluate( ()=>{
        let BooksInfo = [];
        let list = document.querySelectorAll("ul.products-grid-special li.item") 
        for (let book of list){
            let Book = {};
            Book["img"] = book.querySelector("img").src;
            Book["title"] = book.querySelector("h5.product-name a").title;
            Book["autor"] = book.querySelector("div.author").innerText;
            Book["price"] = book.querySelector("span.price").innerText;
            BooksInfo.push(Book)
        }
        return BooksInfo 
    })
    await fs.writeFile("ejercicio1.json", JSON.stringify(res), function(err){
        if(err) throw err;
    })
    console.log("Scraping Successfull!")
    await browser.close()
  })();