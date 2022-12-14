const format = require('date-fns/format');
const fs = require("fs");
const docx = require("docx");
const { Document, Packer, Paragraph, TextRun, SectionType, ExternalHyperlink } = docx;
const subDays = require('date-fns/subDays');

function convertAndSaveResult (newsArray = []) {
    const doc = new Document({
        sections: newsArray.map(news => ({
            properties: {
                type: SectionType.CONTINUOUS,},
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
                new Paragraph({
                    children: [
                        new ExternalHyperlink({
                            children: [
                                new TextRun({
                                    text: news.href,
                                    style: "Hyperlink",
                                }),
                            ],
                            link: news.href,
                        }),
                    ]
                    
                }),
                new Paragraph({
                    text: news.date,
                }),
                new Paragraph({
                    text: ' ',
                })
            ],
        })),
    });

    const date = format(subDays(new Date(), 1), "dd-MM-yyyy");
    const dir = './reports';

    Packer.toBuffer(doc).then((buffer) => {
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }

        fs.writeFileSync(`${dir}/Дайджест новостей МСБ за ${date}.docx`, buffer);
        console.log("done");
    });
}

module.exports = { convertAndSaveResult };