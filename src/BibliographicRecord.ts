export class BibliographicRecord {
    title: string
    authors1: { firstName1: string; middleName1: string; lastName1: string }[]
    authors2?: { firstName2: string; middleName2: string; lastName2: string }[]
    year: string
    publisher?: string
    city?: string
    isbn?: string
    siteTitle?: string
    link?: string
    accessDate?: string
    proceedingsTitle?: string
    proceedingsInformation?: string
    type?: string
    journal?: string
    issue?: string
    pages?: string
    genre?: string

    constructor(
        title: string, authors1: { firstName1: string; middleName1: string; lastName1: string }[],
        authors2: { firstName2: string; middleName2: string; lastName2: string }[], year: string,
        publisher?: string, city?: string, isbn?: string, siteTitle?: string, link?: string, accessDate?: string,
        proceedingsTitle?: string, proceedingsInformation?: string, type?: string, journal?: string, issue?: string,
        pages?: string, genre?: string
    ) {
        const formattedTitle = title.charAt(0).toUpperCase() + title.slice(1)
        this.title = formattedTitle.endsWith(".") ? formattedTitle.slice(0, -1) : formattedTitle
        this.authors1 = authors1.map(author1 => {
            const formattedFirstName1 = author1.firstName1.length > 1 ? author1.firstName1.charAt(0).toUpperCase() + "." : author1.firstName1
            const formattedMiddleName1 = author1.middleName1.length > 1 ? author1.middleName1.charAt(0).toUpperCase() + "." : author1.middleName1
            const formattedLastName1 = author1.lastName1.charAt(0).toUpperCase() + author1.lastName1.slice(1).toLowerCase()
            return {
                firstName1: formattedFirstName1,
                middleName1: formattedMiddleName1,
                lastName1: formattedLastName1
            }
        })
        this.authors2 = authors2.map(author2 => {
            const formattedFirstName2 = author2.firstName2.length > 1 ? author2.firstName2.charAt(0).toUpperCase() + "." : author2.firstName2
            const formattedMiddleName2 = author2.middleName2.length > 1 ? author2.middleName2.charAt(0).toUpperCase() + "." : author2.middleName2
            const formattedLastName2 = author2.lastName2.charAt(0).toUpperCase() + author2.lastName2.slice(1).toLowerCase()
            return {
                firstName2: formattedFirstName2,
                middleName2: formattedMiddleName2,
                lastName2: formattedLastName2
            }
        })
        this.year = year
        this.publisher = publisher
        this.city = city
        this.isbn = isbn
        this.siteTitle = siteTitle
        this.link = link
        this.accessDate = accessDate
        this.proceedingsTitle = proceedingsTitle
        this.proceedingsInformation = proceedingsInformation
        this.type = type
        this.journal = journal
        this.issue = issue
        this.pages = pages
        this.genre = genre
    }

    formatGOST(index: number): string {
        let formattedRecord = `${index + 1}. `
        const formattedAuthors1 = this.authors1.map(author1 => 
            `${author1.lastName1}, ${author1.firstName1}${author1.middleName1}`).join('')
        const formattedAuthors2 = this.authors2?.map(author2 =>
            `, ${author2.firstName2}${author2.middleName2} ${author2.lastName2}`).join('')
        const formattedAuthors3 = this.authors1.map(author1 => 
            `${author1.firstName1}${author1.middleName1} ${author1.lastName1}`)

        if (this.proceedingsTitle) {
            formattedRecord += `${formattedAuthors1} ${this.title} // ${this.proceedingsTitle}: ${this.proceedingsInformation}. ${this.city}, ${this.year}. С. ${this.pages}.`
        }

        if (this.siteTitle) {
            formattedRecord += `${this.siteTitle} // ${this.title} URL: ${this.link} (дата обращения: ${this.accessDate}).`
        }

        if (this.genre) {
            formattedRecord += `${formattedAuthors1} ${this.title}: ${this.genre} / ${formattedAuthors3}`
        }

        if (this.journal) {
            formattedRecord += `${formattedAuthors1} ${this.title} / ${formattedAuthors3}`
        }

        if (formattedAuthors2) {
            formattedRecord += formattedAuthors2
        }

        if (this.publisher) {
            formattedRecord += `; ${this.publisher}. – ${this.city}: Изд-во ${this.publisher}, ${this.year}. – ${this.pages} c. – ${this.isbn}.`
        }

        if (this.journal) {
            formattedRecord += ` // ${this.journal}. – ${this.year}. – №${this.issue}. – С. ${this.pages}.`
        }

        return formattedRecord;
    }
}
