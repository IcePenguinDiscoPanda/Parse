const format = require('date-fns/format');
const fs = require("fs");
const docx = require("docx");
const { Document, Packer, Paragraph, TextRun} = docx;

function convertAndSaveResult (newsArray = []) {
    const doc = new Document({
        sections: newsArray.map(news => ({
            properties: {},
            children: [
                new Paragraph({
                    children: [
                        new TextRun({
                            text: news.name,
                            color: "000000",
                            size: 26,
                        }),
                    ],
                }),
                // new Paragraph({
                //     children: [
                //         new ExternalHyperlink({
                //             children: [
                //                 new TextRun({
                //                     text: "This is an external link!",
                //                     style: "Hyperlink",
                //                 }),
                //             ],
                //             link: news.href,
                //         }),
                //     ],
                // }),
                new Paragraph({
                    text: news.href,
                }),
                new Paragraph({
                    text: news.date,
                })
            ],
        })),
    });

    const date = format(new Date(), "dd-MM-yyyy");
    const dir = './reports';

    Packer.toBuffer(doc).then((buffer) => {
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        fs.writeFileSync(`${dir}/Отчет за ${date}.docx`, buffer);
        console.log("done");
    });
}

module.exports = { convertAndSaveResult };