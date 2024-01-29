// Assignment //



// importing necessary Node.js modulesc(not using any external libraries)
const http = require('http');
const https = require('https');

// setting the server configuration
const hostname = 'localhost';
const port = 3000;

// creating server
const server = http.createServer((req, res) => {
    // GET request /getTimeStories
    if (req.url === '/getTimeStories' && req.method === 'GET') {
        fetchTimeStoriesAndRespond(res);
    } else {
        // handling other routes other than /getTimeStories and responding 404 to all other routes
        res.statusCode = 404;
        res.end('ERROR PAGE NOT FOUND CHECK URL');
    }
});

// FUNCTION to get stories will be parsed by other function
function fetchTimeStoriesAndRespond(response) {
    // calling time.com 
    https.get('https://time.com', (res) => {
        let htmlData = '';

        // collecting different chunks of data and adding them to htmlData
        res.on('data', (chunk) => {
            htmlData += chunk;
        });


        res.on('end', () => {
            // extracting top stories
            const stories = extractLatestStories(htmlData);

            // Sending JSON response
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify(stories));
        });
    }).on('error', (error) => {
        console.error('An error occurred:', error);
    });
}

//Function to extract latest stories from HTMLdata
function extractLatestStories(html) {
    const stories = [];
    let startIndex = 0, endIndex = 0;

    // parsing logic using the html structure of time.com(by inspecting the webpage)

    for (let i = 0; i < 6; i++) {
        startIndex = html.indexOf('<li class="latest-stories__item">', startIndex);
        if (startIndex === -1) break; //end

        startIndex = html.indexOf('<a href="', startIndex) + 9;
        endIndex = html.indexOf('">', startIndex);
        const storyLink = "https://time.com" + html.substring(startIndex, endIndex);

        startIndex = html.indexOf('>', endIndex + 2) + 1;
        endIndex = html.indexOf('</h3>', startIndex);
        const storyTitle = html.substring(startIndex, endIndex).trim();

        stories.push({ title: storyTitle, link: storyLink });
        startIndex = endIndex;
    }

// returning extracted stories in desired JSON format
    return stories; 
}

// Starting server with configs mentioned above
server.listen(port, hostname, () => {
    console.log(`Time Stories Server is up and running at http://${hostname}:${port}/`);
});
