const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const searchUrl = 'https://api-search.docs.aws.amazon.com/search';
const headers = {
    // Headers remain the same
};

let notFoundCounter = 0;
let uploadedCount = 0;
const results = [];

const fetchPdfLink = async (url) => {
    try {
        const response = await axios.get(url);
        if (response.status === 200) {
            const $ = cheerio.load(response.data);
            const pdfLink = $("a[href*='.pdf']").attr('href');
            return pdfLink ? new URL(pdfLink, url).href : null;
        } else {
            throw new Error(`Status code: ${response.status}`);
        }
    } catch (error) {
        notFoundCounter++;
        console.error(`PDF not found or error for ${url}`);
        return null;
    }
};



const downloadFile = async (url) => {
    const response = await axios({
        method: 'GET',
        url: url,
        responseType: 'stream'
    });
    const filename = path.basename(new URL(url).pathname);
    const outputDir = path.resolve(__dirname, 'output');
     if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir);
    }
    const localFilePath = path.resolve(outputDir, filename);
    const writer = fs.createWriteStream(localFilePath);
    response.data.pipe(writer);
    return new Promise((resolve, reject) => {
        writer.on('finish', () => resolve(localFilePath));
        writer.on('error', reject);
    });
};

const processPdfLink = async (pdfLink) => {
    if (!pdfLink) return;
    
   
        console.log(`Downloading PDF from: ${pdfLink}`);
        const localFilePath = await downloadFile(pdfLink);
       console.log(`Saved ${path.basename(localFilePath)} to 'output' directory.`);
        uploadedCount++;
     
};

const fetchData = async (queryString) => {
    console.log(`Searching for: ${queryString}`);
    let pageNumber = 1;
    const fetchPage = async () => {
        try {
            const response = await axios.post(searchUrl, {
                'QueryText': queryString,
                'PageNumber': pageNumber,
                'PageSize': 50,
                'Locale': 'en_us',
                'Previous': ''
            }, { headers: headers });

            if (response.status === 200 && response.data.ResultItems.length > 0) {
                for (const item of response.data.ResultItems) {
                    if (!results.some(result => result.Id === item.Id)) {
                        const pdfLink = await fetchPdfLink(item.DocumentURI);
                        results.push({
                            'Document Title': item.DocumentTitle.Text,
                            'Id': item.Id,
                            'PDF Link': pdfLink,
                            'foundValidPdf': pdfLink !== null
                        });
                    }
                }
                pageNumber++;
                await fetchPage(); // Recursive call for the next page
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                console.log('Reached the end of results or encountered a bad request.');
            } else {
                console.error('Error fetching data:', error);
            }
        }
    };
    await fetchPage();
};

const processResults = async () => {
    for (const result of results) {
        if (result['foundValidPdf']) {
            await processPdfLink(result['PDF Link']);
        }
    }
    console.log('\n--- Process Summary ---');
    console.log('Total Results:', results.length);
    console.log('Links with valid PDF URLs:', results.filter(result => result.foundValidPdf).length);
    console.log('Links without valid PDF URLs:', notFoundCounter);
    console.log('Total Uploaded Documents:', uploadedCount);
    console.log('-----------------------\n');
};

rl.question('Enter values separated by commas (e.g., s3, ec2, whitepapers): ', async (input) => {
    let queryStrings = input.split(',').map(item => item.trim());
    rl.close();

    // Now that queryStrings is populated, proceed with the rest of the process
    console.log("AWS services searched:", queryStrings);
    for (const queryString of queryStrings) {
        await fetchData(queryString);
    }

    // After fetching data, process results
    await processResults();
});
