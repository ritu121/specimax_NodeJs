 var template = 'basic';
 var devMode = false;
 
 // No need to edit below this line
 const Q = require('q');
 const fs = require('fs');
 const os = require('os');
 const pdf = require('html-pdf');
 const twig = require('twig');
 const chalk = require('chalk');
 const minimist = require('minimist')(process.argv.slice(2));
 const cvData = {} //require('./data/cv.json');
 const PDFoptions = require('../../../pdf-options.json')
 path = require('path');
let companyLogo = path.join(__dirname, '../../public/uploads/secuber_logo.png');

 path = require('path');

 if (minimist._.length > 0) {
     if (minimist._[0] == 'dev') {
         devMode = true;
 
         if (typeof minimist._[1] !== 'undefined') {
             template = minimist._[1];
             if( !checkTemplateFolder( 'basic' ) ) {
                 return;
             }
         }
     } else {
         template = minimist._[0];
         if( !checkTemplateFolder( 'basic' ) ) {
             return;
         }
     }
 }
 
 /**
  * Helper stuff for template
  */
 const meta = {
     template: template,
     devMode: devMode,
     root: getRoot()
 }
 cvData.meta = meta;

 PDFoptions.base += template;
 
 exports.generateResume = (data)=> {
    if (minimist._.length > 0) {
        if (minimist._[0] == 'dev') {
            devMode = true;
            if (typeof minimist._[1] !== 'undefined') {
                template = minimist._[1];
                if( !checkTemplateFolder( template ) ) {
                    return;
                }
            }
        } else {
            template = minimist._[0];
            if( !checkTemplateFolder( template ) ) {
                return;
            }
        }
    }
    
    /**
     * Helper stuff for template
     */
    template = "basic"
    const meta = {
        template: template,
        devMode: devMode,
        root: getRoot()
    }
    cvData.meta = meta;
    
    /**
     * Tell "html-pdf" which template to look assets for
     */
    PDFoptions.base += template;
     var createTemplate = Q.denodeify(twig.renderFile);
     let fileName = path.join(__dirname, `../../views/`);
     data.meta=cvData.meta;
    data.companyLogo=companyLogo
    console.log('data.com',data.companyLogo,companyLogo)
     var renderedTemplate = createTemplate( fileName + template + '/cv.twig', data);
     console.log('aa',(fileName + template + '/cv.twig'))
     renderedTemplate.then(function (html) {
        var deferred = Q.defer()
        let fileName1 = path.join(__dirname, `../../public/cvs/`);
         pdf.create(html, PDFoptions).toFile(fileName1+ `${data._id}.pdf`, (err, res) => {
             if (err) {
                 deferred.reject(err);
             } else {
                 deferred.resolve(res);
             }
         });
         return deferred.promise;
     }).then(() => {
         console.log(chalk.cyan('SUCCESS: Your CV is baked as ordered!'));
     }, (err) => {
         console.log(chalk.red('ERROR: ' + err));
     });

 }

 exports.generateTimesheet = (data)=> {
    if (minimist._.length > 0) {
        if (minimist._[0] == 'dev') {
            devMode = true;
    
            if (typeof minimist._[1] !== 'undefined') {
                template = minimist._[1];
                if( !checkTemplateFolder( template ) ) {
                    return;
                }
            }
        } else {
            template = minimist._[0];
            if( !checkTemplateFolder( template ) ) {
                return;
            }
        }
    }
    
    /**
     * Helper stuff for template
     */
    const meta = {
        template: template,
        devMode: devMode,
        root: getRoot()
    }
    cvData.meta = meta;
    
    /**
     * Tell "html-pdf" which template to look assets for
     */
    PDFoptions.base += template;
     var createTemplate = Q.denodeify(twig.renderFile);
     let fileName = path.join(__dirname, `../../views/`);
     data.meta=cvData.meta;
     var renderedTemplate = createTemplate( fileName + template + '/timesheet.twig', data);
     renderedTemplate.then(function (html) {
         var deferred = Q.defer()
        let fileName1 = path.join(__dirname, `../../public/timesheets/`);
        
         pdf.create(html, PDFoptions).toFile(fileName1+ `${data._id}.pdf`, (err, res) => {
             if (err) {
                 deferred.reject(err);
             } else {
                 deferred.resolve(res);
             }
         });
         return deferred.promise;
     }).then(() => {
         console.log(chalk.cyan('SUCCESS: Your CV is baked as ordered!'));
     }, (err) => {
         console.log(chalk.red('ERROR: ' + err));
     });

 }
 
 function getFileProtocolPath() {
     if( os.platform() === 'win32' ) {
         var path = __dirname.split('\\');
     } else {
         var path = __dirname.split('/');
     }
     path[0] = 'file://';
     return path.join('/');
 }
 
 function getRoot() {
     var root = getFileProtocolPath();
     if( devMode ) {
         return template;
     } else {
         return path.join(root, '../../views/' )+ template;
     }
 }
 
 function checkTemplateFolder( templateId ) {
     try {
         fs.accessSync('views/' + templateId, fs.F_OK);
         return true;
     } catch (e) {
         return false;
     }
 }
 