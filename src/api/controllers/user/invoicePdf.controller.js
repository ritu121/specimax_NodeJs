const pdfKit = require('pdfkit');
const fs = require('fs');
path = require('path');
let companyLogo = path.join(__dirname, '../../../public/uploads/picture-1657921142299.jpeg');
let fileName = path.join(__dirname, '../../../public/uploads/sample-invoice1.pdf');
let fontNormal = 'Helvetica';
let fontBold = 'Helvetica-Bold';
const url = require('url');

let sellerInfo = {
    "companyName": "Secuber Technologies",
    "address": "SpaciMax Pty Ltd",
    "city": "ABN: 54 653 066 196",
    "state": "903/50 Clarence St, Sydney NSW 2000",
    "pincode": "",
    "country": "",
    "contactNo": ""
}

let customerInfo = {
    "customerName": "Customer ABC",
    "address": "R783, Rose Apartments, Santacruz (E)",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400054",
    "country": "India",
    "contactNo": "+910000000787"
}

let orderInfo = {
    "orderNo": "email",
    "invoiceNo": "MH-MU-1077",
    "invoiceDate": "11/05/2021",
    "invoiceTime": "10:57:00 PM",
    "products": [
        {
            "id": "15785",
            "name": "Acer Aspire E573",
            "company": "Acer",
            "unitPrice": 39999,
            "totalPrice": 39999,
            "qty": 1
        },
        {
            "id": "15786",
            "name": "Dell Magic Mouse WQ1545",
            "company": "Dell",
            "unitPrice": 2999,
            "totalPrice": 5998,
            "qty": 2
        }
    ],
    "totalValue": 45997
}

exports.createPdf=async(email,amount,date,invoiceNo)=> {
    try {

        let pdfDoc = new pdfKit();
        let fileName = path.join(__dirname, `../../../public/uploads/${invoiceNo}.pdf`);

        let stream = fs.createWriteStream(fileName);
        // pdfDoc.addPage({
        //     margins: { top: 10, left: 50, right: 100, bottom: 10 },
        //     size: 'A4',
        //     layout: 'landscape'
        //   });
        if (fs.existsSync(companyLogo)) {
            pdfDoc.image(companyLogo, 25, 20, { width: 70, height: 70 });
        }

        // pdfDoc.image(companyLogo, 25, 20, { width: 70, height: 70 });
        pdfDoc.font(fontBold).text('Tax Invoice', 280, 75);
        // pdfDoc.font(fontNormal).fontSize(14).text('Order Invoice/Bill Receipt', 400, 30, { width: 200 });
        // pdfDoc.fontSize(10).text('11-MAY-2021 10:24 PM', 400, 46, { width: 200 });

        // pdfDoc.font(fontBold).text("Sold by:", 7, 100);
        pdfDoc.font(fontNormal).text(sellerInfo.companyName, 50, 115, { width: 250 });
        pdfDoc.text(sellerInfo.address, 50, 130, { width: 250 });
        pdfDoc.text(sellerInfo.city + " " + sellerInfo.pincode, 50, 145, { width: 250 });
        pdfDoc.text(sellerInfo.state + " " + sellerInfo.country, 50, 160, { width: 250 });

        // pdfDoc.font(fontBold).text("Customer details:", 400, 100);
        // pdfDoc.font(fontNormal).text(customerInfo.customerName, 400, 115, { width: 250 });
        // pdfDoc.text(customerInfo.address, 400, 130, { width: 250 });
        // pdfDoc.text(customerInfo.city + " " + customerInfo.pincode, 400, 145, { width: 250 });
        // pdfDoc.text(customerInfo.state + " " + customerInfo.country, 400, 160, { width: 250 });

        pdfDoc.text("To: " + (email||"test@gmail.com"), 50, 195, { width: 250 });
        pdfDoc.text("Date: " + date + " " + orderInfo.invoiceTime, 50, 225, { width: 250 });
        pdfDoc.text("Invoice No: " + invoiceNo, 50, 210, { width: 250 });

        // pdfDoc.rect(7, 250, 560, 20).fill("#FC427B").stroke("#FC427B");
        pdfDoc.text("Description of Supply", 50, 256, { width: 130 });
        pdfDoc.text("", 110, 256, { width: 190 });
        pdfDoc.text("", 300, 256, { width: 100 });
        pdfDoc.text("", 400, 256, { width: 100 });
        pdfDoc.text("Sub Total", 500, 256, { width: 100 });
        pdfDoc.rect(50, 256 + (1 * 10), 560, 0.2).fillColor("#000").stroke("#000");


        let productNo = 1;
        // orderInfo.products.forEach(element => {
        let y = 256 + (productNo * 20);
        pdfDoc.text("Casual shift/s booking made on "+date, 50, y, { width: 190 });
        pdfDoc.text("", 110, y, { width: 190 });
        pdfDoc.text("", 300, y, { width: 100 });
        pdfDoc.text("", 400, y, { width: 100 });
        pdfDoc.text(amount, 500, y, { width: 100 });
        productNo++;
        // });
        y = 256 + (productNo * 23);
        pdfDoc.text("Service fee  ", 50, y, { width: 90 });
        pdfDoc.text("", 110, y, { width: 190 });
        pdfDoc.text("", 300, y, { width: 100 });
        pdfDoc.text("", 400, y, { width: 100 });
        pdfDoc.text("$0", 500, y, { width: 100 });
        productNo++;

        pdfDoc.rect(50, 256 + (productNo * 23), 560, 0.2).fillColor("#000").stroke("#000");
        productNo++;

        pdfDoc.font(fontBold).text("Invoice total including Service fee :", 50, 256 + (productNo * 17));
        pdfDoc.font(fontBold).text(amount, 500, 256 + (productNo * 17));
        pdfDoc.pipe(stream);
        pdfDoc.end();
    } catch (error) {
        console.log("Error occurred", error);
    }
}

exports.generateLicense=async(name,state,number, country, authority,id,picture)=> {
    try {

        let pdfDoc = new pdfKit();
        let fileName = path.join(__dirname, `../../../public/uploads/${id}.pdf`);

        let stream = fs.createWriteStream(fileName);
        // pdfDoc.addPage({
        //     margins: { top: 10, left: 50, right: 100, bottom: 10 },
        //     size: 'A4',
        //     layout: 'landscape'
        //   });
        
        let urlObject = url.parse(picture, true);
        let licenseImage = path.join(__dirname, `../../../public/${urlObject.path}`);
        // console.log(licenseImage)
        // pdfDoc.image(companyLogo, 25, 20, { width: 120, height: 70 });
        if (fs.existsSync(companyLogo)) {
            pdfDoc.image(companyLogo, 25, 20, { width: 120, height: 70 });
        }
        pdfDoc.font(fontBold).text('User License', 280, 75);
        if (fs.existsSync(licenseImage)) {
            pdfDoc.image(licenseImage, 250, 120, { width: 70, height: 70 });
        }
        // try {
        //     pdfDoc.image(licenseImage, 250, 120, { width: 70, height: 70 });
        // } catch (error) {
        //     console.log(error)
        // }
        // pdfDoc.font(fontNormal).fontSize(14).text('Order Invoice/Bill Receipt', 400, 30, { width: 200 });
        // pdfDoc.fontSize(10).text('11-MAY-2021 10:24 PM', 400, 46, { width: 200 });

        // pdfDoc.font(fontBold).text("Sold by:", 7, 100);
        // pdfDoc.font(fontNormal).text(sellerInfo.companyName, 50, 115, { width: 250 });
        // pdfDoc.text(sellerInfo.address, 50, 130, { width: 250 });
        // pdfDoc.text(sellerInfo.city + " " + sellerInfo.pincode, 50, 145, { width: 250 });
        // pdfDoc.text(sellerInfo.state + " " + sellerInfo.country, 50, 160, { width: 250 });

        // pdfDoc.font(fontBold).text("Customer details:", 400, 100);
        // pdfDoc.font(fontNormal).text(customerInfo.customerName, 400, 115, { width: 250 });
        // pdfDoc.text(customerInfo.address, 400, 130, { width: 250 });
        // pdfDoc.text(customerInfo.city + " " + customerInfo.pincode, 400, 145, { width: 250 });
        // pdfDoc.text(customerInfo.state + " " + customerInfo.country, 400, 160, { width: 250 });

        pdfDoc.font(fontNormal).text("Name: " + (name||"test"), 50, 210, { width: 250 });
        pdfDoc.text("Authority: " + (authority||"test"), 50, 225, { width: 250 });
        pdfDoc.text("License No: " + number, 50, 240, { width: 250 });
        pdfDoc.text("State: " + state, 50, 255, { width: 250 });
        pdfDoc.text("Country: " + country, 50, 270, { width: 130 });

        // pdfDoc.rect(7, 250, 560, 20).fill("#FC427B").stroke("#FC427B");
        // pdfDoc.text("", 110, 256, { width: 190 });
        // pdfDoc.text("", 300, 256, { width: 100 });
        // pdfDoc.text("", 400, 256, { width: 100 });
        // pdfDoc.text("Sub Total", 500, 256, { width: 100 });
        // pdfDoc.rect(50, 256 + (1 * 10), 560, 0.2).fillColor("#000").stroke("#000");


        // let productNo = 1;
        // // orderInfo.products.forEach(element => {
        //     // console.log("adding", element.name);
        // let y = 256 + (productNo * 20);
        // pdfDoc.text("Casual shift/s booking made on "+date, 50, y, { width: 190 });
        // pdfDoc.text("", 110, y, { width: 190 });
        // pdfDoc.text("", 300, y, { width: 100 });
        // pdfDoc.text("", 400, y, { width: 100 });
        // pdfDoc.text(amount, 500, y, { width: 100 });
        // productNo++;
        // // });
        // y = 256 + (productNo * 23);
        // pdfDoc.text("Service fee  ", 50, y, { width: 90 });
        // pdfDoc.text("", 110, y, { width: 190 });
        // pdfDoc.text("", 300, y, { width: 100 });
        // pdfDoc.text("", 400, y, { width: 100 });
        // pdfDoc.text("$0", 500, y, { width: 100 });
        // productNo++;

        // pdfDoc.rect(50, 256 + (productNo * 23), 560, 0.2).fillColor("#000").stroke("#000");
        // productNo++;

        // pdfDoc.font(fontBold).text("Invoice total including Service fee :", 50, 256 + (productNo * 17));
        // pdfDoc.font(fontBold).text(amount, 500, 256 + (productNo * 17));
        pdfDoc.pipe(stream);
        pdfDoc.end();
        // console.log("pdf generate successfully");
    } catch (error) {
        console.log("Error occurred", error);
    }
}

