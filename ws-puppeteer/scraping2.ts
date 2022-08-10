const puppeteer = require("puppeteer");
const fs = require("fs");


(async () => { 
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    let results = []
    let urls = ["https://www.tematika.com/libros?limit=40&p=1"]
    let count = 1
    for(let url of urls){
        await page.goto(url)
        let res = await page.evaluate(()=>{
            let BooksInfo = [];
            let list = document.querySelectorAll("ul.products-grid-special li.item") 
            for (let book of list){
                let Book = {};
                Book["img"] = book.querySelector("img").src;
                Book["title"] = book.querySelector("h5.product-name a").title;
                Book["autor"] = book.querySelector("div.author");
                if(Book["autor"] == null){
                    Book["autor"] = null
                } else{
                    Book["autor"] = book.querySelector("div.author").innerText;
                }
                Book["price"] = book.querySelector("span.price").innerText;
                BooksInfo.push(Book)
            }
            
            let new_url = document.querySelector(".i-next").href
            console.log(new_url)
            new_url = new_url.substring(0,new_url.indexOf('?'))+'?limit=40&'+new_url.substring(new_url.indexOf('p='),new_url.length)
            return [BooksInfo, new_url]
        })
        if (res[1] && urls.length<25){ urls.push(res[1]) }
        console.log(res[1])
        console.log("Done !")
        results = results.concat(res[0])
    }
    await fs.writeFile("ejercicio2.json", JSON.stringify(results), function(err){
        if(err) throw err;
    })
    await browser.close()
  })();