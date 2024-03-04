# AWS Document Downloader CLI Tool

## Overview

This repository contains the AWS Document Downloader CLI Tool, a Node.js-based command-line interface tool designed for downloading AWS documentation. Users can input search terms, and the tool fetches broad and comprehensive PDF documents relevant to those terms. This approach ensures that users gain a wide perspective on topics of interest rather than focusing on narrowly targeted documents.

## Features

- **User-Driven Search Terms**: Input keywords or phrases to locate AWS documentation.
- **Comprehensive Results**: Downloads are not limited to exact matches, providing a broader overview of the subject matter.
- **Automatic Downloads**: The tool automatically retrieves and saves PDF documents based on the provided search criteria.
- **CLI Interface**: A straightforward command-line interface makes the tool accessible and easy to use within any standard terminal environment.

## Prerequisites

Before using the AWS Document Downloader CLI Tool, ensure you have the following installed:
- Node.js (version 12.x or higher recommended)
- npm (comes bundled with Node.js)

## Usage

To set up the tool on your system, follow these steps:

1. **Clone the Repository**:
   Clone this repository to your local machine using the following Git command:
   ```
   git clone https://github.com/bit-cloner/download-aws-docs.git
   cd download-aws-docs
   npm install
   node server.js
   ```
### Input Search Terms
When prompted, enter your search terms. You can input multiple terms separated by commas.

### Downloading Documents
The tool will proceed to search for, identify, and download relevant PDF documents into the "output" directory.

### Contributing
Contributions to the AWS Document Downloader CLI Tool are welcome! Feel free to open issues or pull requests for feature enhancements, bug fixes, or documentation improvements.

### License
This project is licensed under the MIT License - see the `LICENSE` file for details.

**Disclaimer**: This tool is independently created and maintained. It is not officially affiliated with or endorsed by AWS.


