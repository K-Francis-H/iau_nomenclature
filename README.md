# iau_nomenclature
A NodeJS script to dump the most recent version of the IAU's nomenclature for geologic features on heavenly bodies.

Installation
------------
npm install

Usage
-----------
node dump-iau-nomenclature.js [OPTIONS]

Options
----------
--help : Print help message

--version: Print version string

--xml : Fetch data in XML (eXtensible Markup Language) format (Default)

--json : Fetch data in XML format then convert to JSON (turns XML tag attributes into JSON fields)

--csv : Fetch data in CSV (Comma Separated Values) format

--tsv : Fetch data in TSV (Tab Seaparated Values) format

--kml : Fetch data in KML (Keyhole Markup Language) format
