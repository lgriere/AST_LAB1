# Asynchronous Server Technology - Labs

[![Build Status](https://travis-ci.org/lgriere/AST_LAB1.svg?branch=master)](https://travis-ci.org/lgriere/AST_LAB1)

### Introduction
This is a Node.js lab that returns a different content depending on the route parameters.

The possible routes are :
  * ```/``` which is the home page and explains how */hello* website works with the links to the other routes
  * ```/hello/[your name]``` returns *Hello [your name]!*
  * ```/hello/Lisa``` returns a short introduction of myself
  
Any other route returns an **Error**

## Requirements
Node.js : https://nodejs.org/en/download/

## Run instruction
1. Clone the repository
2. Run ```npm install``` to have the project dependencies
3. Run ```node index.js```
4. Open your browser and go to http://localhost:8080/

## Contributor
Lisa Griere

