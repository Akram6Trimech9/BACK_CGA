const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

 const dir = path.resolve(__dirname, './uploads/generatedPDfs');
if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
}

 const generateHTML = (affaire, client, credits) => {
    const audiancesHTML = affaire.audiances.map(audiance => `
        <tr>
            <td>${audiance.numero || 'N/A'}</td>
            <td>${new Date(audiance.dateAudiance).toLocaleDateString() || 'N/A'}</td>
            <td>${audiance.description || 'N/A'}</td>
        </tr>
    `).join('');

    const creditsHTML = credits.payedCredit.map(credit => `
        <tr>
            <td>${credit.part || 'N/A'} €</td>
            <td>${new Date(credit.date).toLocaleDateString() || 'N/A'}</td>
            <td>${credit.method || 'N/A'}</td>
            <td>${credit.natureTranche || 'N/A'}</td>
        </tr>
    `).join('');

     const logoPath = path.resolve(__dirname, './uploads/cga_logo.png');

    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Facture</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { text-align: center; }
        .header { display: flex; justify-content: space-between; align-items: center; }
        .client-info, .affaire-info { margin-top: 20px; }
        .section-title { font-size: 16px; margin-top: 20px; text-decoration: underline; }
        table { width: 100%; border-collapse: collapse; margin-top: 10px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .total { text-align: right; font-weight: bold; margin-top: 10px; }
        .flex-container {
            display: flex;
            justify-content: space-between;
            margin-top: 20px;
        }
        #demoFont {
            font-family: "Lucida Sans Unicode", "Lucida Grande", sans-serif;
            font-size: 32px;
            letter-spacing: 6px;
            word-spacing: 6px;
            color: #140734;
            font-weight: 700;
            text-decoration: overline rgb(68, 68, 68);
            font-style: normal;
            font-variant: normal;
            text-transform: capitalize;
            }
    </style>
</head>
<body>
    <div class="header">
        <div>
        <div id="demoFont">CGA</div>
                </div>
        <div>
            <p>CGA </p>
            <p>Sousse</p>
        </div>
    </div>

    <h1>Facture</h1>

    <div class="flex-container">
        <div class="client-info">
            <p>Client: ${client.username || 'N/A'} ${client.lastname || 'N/A'}</p>
            <p>Adresse: ${client.address || 'N/A'}</p>
            <p>Email: ${client.email || 'N/A'}</p>
        </div>

        <div class="affaire-info">
            <p>Numéro Affaire: ${affaire.numeroAffaire || 'N/A'}</p>
            <p>Nature de l'Affaire: ${affaire.natureAffaire || 'N/A'}</p>
            <p>Opposant: ${affaire.opposite || 'N/A'}</p>
            <p>Degré: ${affaire.degre || 'N/A'}</p>
        </div>
    </div>

    <div class="section-title">Détails des Audiences</div>
    <table>
        <thead>
            <tr>
                <th>Numéro</th>
                <th>Date</th>
                <th>Description</th>
            </tr>
        </thead>
        <tbody>
            ${audiancesHTML}
        </tbody>
    </table>

    <div class="section-title">Informations sur le Crédit</div>
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

    <p class="total">Total Crédit: ${credits.totalCredit || 'N/A'} €</p>
</body>
</html>
    `;
};

const generatePDF = async (affaire, client, credits) => {
    const html = generateHTML(affaire, client, credits);
    const pdfPath = path.join(__dirname, './uploads/generatedPDfs', `${affaire.numeroAffaire}.pdf`);

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

        console.log('PDF generated successfully:', pdfPath);
        return pdfPath;
    } catch (error) {
        console.error('Error generating PDF:', error);
        throw error;
    }
};

module.exports = {
    generatePDF
};
