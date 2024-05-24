import * as fs from "fs"
import { DOMParser as dom } from '@xmldom/xmldom'
import { selectWithResolver } from "xpath"
import { BibliographicRecord } from "./BibliographicRecord"

class BibliographyProcessor {
    records: BibliographicRecord[] = []

    loadFromFile(filename: string): void {
        const xmlData = fs.readFileSync(filename, "utf-8")
        const doc = new dom().parseFromString(xmlData, "text/xml")
        const entries = selectWithResolver("//entry", doc) as Element[]

        entries.forEach(entry => {
            const authors1 = (selectWithResolver("author1", entry) as Element[]).map(authorNode1 => {
                const [firstNameNode1, middleNameNode1, lastNameNode1] = [
                    selectWithResolver("firstName/text()", authorNode1),
                    selectWithResolver("middleName/text()", authorNode1),
                    selectWithResolver("lastName/text()", authorNode1)
                ]
            
                return {
                    firstName1: firstNameNode1 ? firstNameNode1.toString() : "",
                    middleName1: middleNameNode1 ? middleNameNode1.toString() : "",
                    lastName1: lastNameNode1 ? lastNameNode1.toString() : ""
                }
            })
            
            const authors2 = (selectWithResolver("author2", entry) as Element[]).map(authorNode2 => {
                const [firstNameNode2, middleNameNode2, lastNameNode2] = [
                    selectWithResolver("firstName/text()", authorNode2),
                    selectWithResolver("middleName/text()", authorNode2),
                    selectWithResolver("lastName/text()", authorNode2)
                ]
            
                return {
                    firstName2: firstNameNode2 ? firstNameNode2.toString() : "",
                    middleName2: middleNameNode2 ? middleNameNode2.toString() : "",
                    lastName2: lastNameNode2 ? lastNameNode2.toString() : ""
                }
            })
            
            const recordData: any = {};
            const fields = ["title", "year", "publisher", "city", "isbn", "siteTitle", "link", "accessDate",
                "proceedingsTitle", "proceedingsInformation", "type", "journal", "issue", "pages", "genre"]
    
            fields.forEach(field => {
                const node = selectWithResolver(`${field}/text()`, entry)
                recordData[field] = node ? node.toString() : undefined
            })
    
            const record = new BibliographicRecord(recordData.title, authors1, authors2, recordData.year,
                recordData.publisher, recordData.city, recordData.isbn, recordData.siteTitle, recordData.link,
                recordData.accessDate, recordData.proceedingsTitle, recordData.proceedingsInformation, recordData.type,
                recordData.journal, recordData.issue, recordData.pages, recordData.genre)
    
            this.addRecord(record)
        })
    }
    
    addRecord(record: BibliographicRecord): void {
        this.records.push(record)
    }

    printGOST(): void {
        this.records.forEach((record, index) => {
            console.log(record.formatGOST(index))
        })
    }
}

const processor = new BibliographyProcessor()
processor.loadFromFile("bibliography.xml")
console.log("Библиографический список")
processor.printGOST()