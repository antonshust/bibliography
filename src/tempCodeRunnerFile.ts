loadFromFile(filename: string): void {
        const xmlData = fs.readFileSync(filename, "utf-8");
        const doc = new dom().parseFromString(xmlData, "text/xml");
        const entries = selectWithResolver("//entry", doc) as Element[];
    
        entries.forEach(entry => {
            const recordData: any = {};
            const fields = ["title", "year", "publisher", "city", "isbn", "siteType", "link", "accessDate",
                "proceedingsTitle", "proceedingsInformation", "type", "journal", "issue", "pages", "genre"];
    
            fields.forEach(field => {
                const node = selectWithResolver(`${field}/text()`, entry);
                recordData[field] = node ? node.toString() : undefined;
            });
    
            // Проверка на существование авторов перед использованием метода map()
            const authors1 = recordData.authors1 ? this.extractAuthors(entry, "author1") : [];
            const authors2 = recordData.authors2 ? this.extractAuthors(entry, "author2") : [];
    
            const record = new BibliographicRecord(recordData.title, authors1, authors2, recordData.year,
                recordData.publisher, recordData.city, recordData.isbn, recordData.siteType, recordData.link,
                recordData.accessDate, recordData.proceedingsTitle, recordData.proceedingsInformation, recordData.type,
                recordData.journal, recordData.issue, recordData.pages, recordData.genre);
    
            this.addRecord(record);
        });
    }
    
    
    extractAuthors(entry: Element, authorType: string): any[] {
        const authorNodes = selectWithResolver(`./${authorType}`, entry) as Element[];
        return authorNodes.map(authorNode => {
            const firstName = selectWithResolver("./firstName/text()", authorNode)?.toString() || "";
            const middleName = selectWithResolver("./middleName/text()", authorNode)?.toString() || "";
            const lastName = selectWithResolver("./lastName/text()", authorNode)?.toString() || "";
            return { firstName, middleName, lastName };
        });
    }