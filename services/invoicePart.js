const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const generateInvoiceHTML = (credit) => {
    console.log('Credit Object:', credit);

    const creditsHTML = Array.isArray(credit.payedCredit) 
        ? credit.payedCredit.map(payedCredit => `
            <tr>
                <td>${payedCredit.part || 'N/A'} €</td>
                <td>${new Date(payedCredit.date).toLocaleDateString('fr-FR') || 'N/A'}</td>
                <td>${payedCredit.method || 'N/A'}</td>
                <td>${payedCredit.natureTranche || 'N/A'}</td>
            </tr>
        `).join('')  // Join the array into a single string
        : `
            <tr>
                <td>${credit.payedCredit.part || 'N/A'} €</td>
                <td>${new Date(credit.payedCredit.date).toLocaleDateString('fr-FR') || 'N/A'}</td>
                <td>${credit.payedCredit.method || 'N/A'}</td>
                <td>${credit.payedCredit.natureTranche || 'N/A'}</td>
            </tr>
        `;

    return `
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { text-align: center; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .total { text-align: right; font-weight: bold; margin-top: 10px; }
    </style>
</head>
<body>
    <h1>Facture</h1>
    <div>
        <p>Client: ${credit.client.username || 'N/A'} ${credit.client.lastname || 'N/A'}</p>
        <p>Numéro de crédit: ${credit._id || 'N/A'}</p>
        <p>Date: ${new Date().toLocaleDateString('fr-FR')}</p>
    </div>
    <table>
        <thead>
            <tr>
                <th>Part</th>
                <th>Date</th>
                <th>Méthode</th>
                <th>Nature</th>
            </tr>
        </thead>
        <tbody>
            ${creditsHTML}
        </tbody>
    </table>
    <p class="total">Total Crédit: ${credit.totalCredit || 'N/A'} €</p>
</body>
</html>
    `;
};

const generateInvoicePDF = async (credit) => {
    const html = generateInvoiceHTML(credit);
    const pdfPath = path.join(__dirname, './uploads/generatedInvoice', `Facture_${credit._id}.pdf`);

    try {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.setContent(html);
        await page.pdf({
            path: pdfPath,
            format: 'A4',
            printBackground: true
        });
        await browser.close();

        console.log('Facture générée avec succès:', pdfPath);
        return pdfPath;
    } catch (error) {
        console.error('Erreur lors de la génération de la facture:', error);
        throw error;
    }
};

module.exports = {
    generateInvoicePDF
};

