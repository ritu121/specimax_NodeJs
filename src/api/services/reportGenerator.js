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
const reportData = {} //require('./data/cv.json');
const PDFoptions = require('../../../report.option.json')
const uuidv4 = require('uuid/v4');

path = require('path');

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
reportData.meta = meta;

PDFoptions.base += template;

async function generateCustomReport(data){
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
   template = 'report';
   /**
    * Helper stuff for template
    */
   const meta = {
       template: template,
       devMode: devMode,
       root: getRoot()
   }
   reportData.meta = meta;
   
   /**
    * Tell "html-pdf" which template to look assets for
    */
    PDFoptions.base += template;
    var createTemplate = Q.denodeify(twig.renderFile);
    let fileName = path.join(__dirname, `../../views/`);
    data.meta=reportData.meta;

    console.log('DATA ----------', data)
    var renderedTemplate = createTemplate( fileName + template + '/custom.twig', data);
    var name = uuidv4();
    await renderedTemplate.then(function (html) {
       var deferred = Q.defer()
       let fileName1 = path.join(__dirname, `../../public/report/`);
        pdf.create(html, PDFoptions).toFile(fileName1+ `${name}.pdf`, (err, res) => {
            if (err) {
                deferred.reject(err);
            } else {
                deferred.resolve(res);
            }
        });
        return deferred.promise;
    
    }).then(async() => {
        console.log(chalk.cyan('SUCCESS: Your CV is baked as ordered!'));
        console.log('NAME-----', name)
        return name;
    }, (err) => {
        console.log(chalk.red('ERROR: ' + err));
        return name;
    });
    return name;
}

async function generateRiskAssessmentReport(data){
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
    template = 'report';
    /**
     * Helper stuff for template
     */
    const meta = {
        template: template,
        devMode: devMode,
        root: getRoot()
    }
    reportData.meta = meta;
    
    /**
     * Tell "html-pdf" which template to look assets for
     */
     PDFoptions.base += template;
     var createTemplate = Q.denodeify(twig.renderFile);
     let fileName = path.join(__dirname, `../../views/`);
     data.meta=reportData.meta;
 
     console.log('DATA ----------', data)
     var renderedTemplate = createTemplate( fileName + template + '/risk-assessment.twig', data);
     var name = uuidv4();
     await renderedTemplate.then(function (html) {
        var deferred = Q.defer()
        let fileName1 = path.join(__dirname, `../../public/report/`);
         pdf.create(html, PDFoptions).toFile(fileName1+ `${name}.pdf`, (err, res) => {
             if (err) {
                 deferred.reject(err);
             } else {
                 deferred.resolve(res);
             }
         });
         return deferred.promise;
     
     }).then(async() => {
         console.log(chalk.cyan('SUCCESS: Your CV is baked as ordered!'));
         console.log('NAME-----', name)
         return name;
     }, (err) => {
         console.log(chalk.red('ERROR: ' + err));
         return name;
     });
     return name;
 }
 

async function generateTaskReport(data){
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
    template = 'report';
    /**
     * Helper stuff for template
     */
    const meta = {
        template: template,
        devMode: devMode,
        root: getRoot()
    }
    reportData.meta = meta;
    
    /**
     * Tell "html-pdf" which template to look assets for
     */
     PDFoptions.base += template;
     var createTemplate = Q.denodeify(twig.renderFile);
     let fileName = path.join(__dirname, `../../views/`);
     data.meta=reportData.meta;
 
    //  console.log('DATA ----------', data)
     var renderedTemplate = createTemplate( fileName + template + '/task.twig', data);
     var name = uuidv4();
     await renderedTemplate.then(function (html) {
        var deferred = Q.defer()
        let fileName1 = path.join(__dirname, `../../public/report/`);
         pdf.create(html, PDFoptions).toFile(fileName1+ `${name}.pdf`, (err, res) => {
             if (err) {
                 deferred.reject(err);
             } else {
                 deferred.resolve(res);
             }
         });
         return deferred.promise;
     
     }).then(async() => {
        //  console.log(chalk.cyan('SUCCESS: Your CV is baked as ordered!'));
        //  console.log('NAME-----', name)
         return name;
     }, (err) => {
         console.log(chalk.red('ERROR: ' + err));
         return name;
     });
     return name;
}


async function generateSupportReport(data){
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
    template = 'report';
    /**
     * Helper stuff for template
     */
    const meta = {
        template: template,
        devMode: devMode,
        root: getRoot()
    }
    reportData.meta = meta;
    
    /**
     * Tell "html-pdf" which template to look assets for
     */
     PDFoptions.base += template;
     var createTemplate = Q.denodeify(twig.renderFile);
     let fileName = path.join(__dirname, `../../views/`);
     data.meta=reportData.meta;
 
     var renderedTemplate = createTemplate( fileName + template + '/support.twig', data);
     var name = uuidv4();
     await renderedTemplate.then(function (html) {
        var deferred = Q.defer()
        let fileName1 = path.join(__dirname, `../../public/report/`);
         pdf.create(html, PDFoptions).toFile(fileName1+ `${name}.pdf`, (err, res) => {
             if (err) {
                 deferred.reject(err);
             } else {
                 deferred.resolve(res);
             }
         });
         return deferred.promise;
     
     }).then(async() => {
         console.log(chalk.cyan('SUCCESS: Your CV is baked as ordered!'));
         console.log('NAME-----', name)
         return name;
     }, (err) => {
         console.log(chalk.red('ERROR: ' + err));
         return name;
     });
     return name;
}


async function generateAlarmReport(data){
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
    template = 'report';
    /**
     * Helper stuff for template
     */
    const meta = {
        template: template,
        devMode: devMode,
        root: getRoot()
    }
    reportData.meta = meta;
    
    /**
     * Tell "html-pdf" which template to look assets for
     */
     PDFoptions.base += template;
     var createTemplate = Q.denodeify(twig.renderFile);
     let fileName = path.join(__dirname, `../../views/`);
     data.meta=reportData.meta;
 
     var renderedTemplate = createTemplate( fileName + template + '/alarm.twig', data);
     var name = uuidv4();
     await renderedTemplate.then(function (html) {
        var deferred = Q.defer()
        let fileName1 = path.join(__dirname, `../../public/report/`);
         pdf.create(html, PDFoptions).toFile(fileName1+ `${name}.pdf`, (err, res) => {
             if (err) {
                 deferred.reject(err);
             } else {
                 deferred.resolve(res);
             }
         });
         return deferred.promise;
     
     }).then(async() => {
         console.log(chalk.cyan('SUCCESS: Your CV is baked as ordered!'));
         console.log('NAME-----', name)
         return name;
     }, (err) => {
         console.log(chalk.red('ERROR: ' + err));
         return name;
     });
     return name;
}

async function generateTendencyReport(data){
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
    template = 'report';
    /**
     * Helper stuff for template
     */
    const meta = {
        template: template,
        devMode: devMode,
        root: getRoot()
    }
    reportData.meta = meta;
    
    /**
     * Tell "html-pdf" which template to look assets for
     */
     PDFoptions.base += template;
     var createTemplate = Q.denodeify(twig.renderFile);
     let fileName = path.join(__dirname, `../../views/`);
     data.meta=reportData.meta;
 
     var renderedTemplate = createTemplate( fileName + template + '/tendency.twig', data);
     var name = uuidv4();
     await renderedTemplate.then(function (html) {
        var deferred = Q.defer()
        let fileName1 = path.join(__dirname, `../../public/report/`);
         pdf.create(html, PDFoptions).toFile(fileName1+ `${name}.pdf`, (err, res) => {
             if (err) {
                 deferred.reject(err);
             } else {
                 deferred.resolve(res);
             }
         });
         return deferred.promise;
     
     }).then(async() => {
         console.log(chalk.cyan('SUCCESS: Your CV is baked as ordered!'));
         console.log('NAME-----', name)
         return name;
     }, (err) => {
         console.log(chalk.red('ERROR: ' + err));
         return name;
     });
     return name;
}

async function generateLogReport(data){
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
    template = 'report';
    /**
     * Helper stuff for template
     */
    const meta = {
        template: template,
        devMode: devMode,
        root: getRoot()
    }
    reportData.meta = meta;
    
    /**
     * Tell "html-pdf" which template to look assets for
     */
     PDFoptions.base += template;
     var createTemplate = Q.denodeify(twig.renderFile);
     let fileName = path.join(__dirname, `../../views/`);
     data.meta=reportData.meta;
 
     var renderedTemplate = createTemplate( fileName + template + '/log.twig', data);
     var name = uuidv4();
     await renderedTemplate.then(function (html) {
        var deferred = Q.defer()
        let fileName1 = path.join(__dirname, `../../public/report/`);
         pdf.create(html, PDFoptions).toFile(fileName1+ `${name}.pdf`, (err, res) => {
             if (err) {
                 deferred.reject(err);
             } else {
                 deferred.resolve(res);
             }
         });
         return deferred.promise;
     
     }).then(async() => {
         console.log(chalk.cyan('SUCCESS: Your CV is baked as ordered!'));
         console.log('NAME-----', name)
         return name;
     }, (err) => {
         console.log(chalk.red('ERROR: ' + err));
         return name;
     });
     return name;
}

async function generateCasualShiftReport(data){
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
    template = 'report';
    /**
     * Helper stuff for template
     */
    const meta = {
        template: template,
        devMode: devMode,
        root: getRoot()
    }
    reportData.meta = meta;
    
    /**
     * Tell "html-pdf" which template to look assets for
     */
     PDFoptions.base += template;
     var createTemplate = Q.denodeify(twig.renderFile);
     let fileName = path.join(__dirname, `../../views/`);
     data.meta=reportData.meta;
 
     var renderedTemplate = createTemplate( fileName + template + '/casual.shift.twig', data);
     var name = uuidv4();
     await renderedTemplate.then(function (html) {
        var deferred = Q.defer()
        let fileName1 = path.join(__dirname, `../../public/report/`);
         pdf.create(html, PDFoptions).toFile(fileName1+ `${name}.pdf`, (err, res) => {
             if (err) {
                 deferred.reject(err);
             } else {
                 deferred.resolve(res);
             }
         });
         return deferred.promise;
     
     }).then(async() => {
         console.log(chalk.cyan('SUCCESS: Your CV is baked as ordered!'));
         console.log('NAME-----', name)
         return name;
     }, (err) => {
         console.log(chalk.red('ERROR: ' + err));
         return name;
     });
     return name;
}


async function generateRosterShiftReport(data){
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
    template = 'report';
    /**
     * Helper stuff for template
     */
    const meta = {
        template: template,
        devMode: devMode,
        root: getRoot()
    }
    reportData.meta = meta;
    
    /**
     * Tell "html-pdf" which template to look assets for
     */
     PDFoptions.base += template;
     var createTemplate = Q.denodeify(twig.renderFile);
     let fileName = path.join(__dirname, `../../views/`);
     data.meta=reportData.meta;
 
     var renderedTemplate = createTemplate( fileName + template + '/roster.shift.twig', data);
     var name = uuidv4();
     await renderedTemplate.then(function (html) {
        var deferred = Q.defer()
        let fileName1 = path.join(__dirname, `../../public/report/`);
         pdf.create(html, PDFoptions).toFile(fileName1+ `${name}.pdf`, (err, res) => {
             if (err) {
                 deferred.reject(err);
             } else {
                 deferred.resolve(res);
             }
         });
         return deferred.promise;
     
     }).then(async() => {
         console.log(chalk.cyan('SUCCESS: Your CV is baked as ordered!'));
         console.log('NAME-----', name)
         return name;
     }, (err) => {
         console.log(chalk.red('ERROR: ' + err));
         return name;
     });
     return name;
}


async function generateClockInOutReport(data){
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
    template = 'report';
    /**
     * Helper stuff for template
     */
    const meta = {
        template: template,
        devMode: devMode,
        root: getRoot()
    }
    reportData.meta = meta;
    
    /**
     * Tell "html-pdf" which template to look assets for
     */
     PDFoptions.base += template;
     var createTemplate = Q.denodeify(twig.renderFile);
     let fileName = path.join(__dirname, `../../views/`);
     data.meta=reportData.meta;
 
     var renderedTemplate = createTemplate( fileName + template + '/clock.twig', data);
     var name = uuidv4();
     await renderedTemplate.then(function (html) {
        var deferred = Q.defer()
        let fileName1 = path.join(__dirname, `../../public/report/`);
         pdf.create(html, PDFoptions).toFile(fileName1+ `${name}.pdf`, (err, res) => {
             if (err) {
                 deferred.reject(err);
             } else {
                 deferred.resolve(res);
             }
         });
         return deferred.promise;
     
     }).then(async() => {
         console.log(chalk.cyan('SUCCESS: Your CV is baked as ordered!'));
         console.log('NAME-----', name)
         return name;
     }, (err) => {
         console.log(chalk.red('ERROR: ' + err));
         return name;
     });
     return name;
}


async function generateFailedReport(data){
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
    template = 'report';
    /**
     * Helper stuff for template
     */
    const meta = {
        template: template,
        devMode: devMode,
        root: getRoot()
    }
    reportData.meta = meta;
    
    /**
     * Tell "html-pdf" which template to look assets for
     */
     PDFoptions.base += template;
     var createTemplate = Q.denodeify(twig.renderFile);
     let fileName = path.join(__dirname, `../../views/`);
     data.meta=reportData.meta;
 
     var renderedTemplate = createTemplate( fileName + template + '/failed.twig', data);
     var name = uuidv4();
     await renderedTemplate.then(function (html) {
        var deferred = Q.defer()
        let fileName1 = path.join(__dirname, `../../public/report/`);
         pdf.create(html, PDFoptions).toFile(fileName1+ `${name}.pdf`, (err, res) => {
             if (err) {
                 deferred.reject(err);
             } else {
                 deferred.resolve(res);
             }
         });
         return deferred.promise;
     
     }).then(async() => {
         console.log(chalk.cyan('SUCCESS: Your CV is baked as ordered!'));
         console.log('NAME-----', name)
         return name;
     }, (err) => {
         console.log(chalk.red('ERROR: ' + err));
         return name;
     });
     return name;
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

module.exports = { generateCustomReport, generateTaskReport,generateRiskAssessmentReport, generateSupportReport, generateAlarmReport, generateLogReport, generateTendencyReport, generateCasualShiftReport, generateRosterShiftReport, generateClockInOutReport, generateFailedReport}