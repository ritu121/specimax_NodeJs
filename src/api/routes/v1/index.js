const express = require('express');
const authRoutes = require('./auth.route');
const userRoutes = require('./user.route');
const trackerRoutes = require('./tracker.route');
const timesheetStatusRoutes = require('./timesheet.status.route');
const supportStatusRoutes = require('./support.status.route');
const timesheetRoutes = require('./timesheet.route');
const supportRoutes = require('./support.route');
const roleRoutes = require('./role.route');
const companyRoutes = require('./company.route');
const vendorRoutes = require('./vendor.route');
const cleintMap = require('./vendor.map.routes');
const stateRoutes = require('./states.route');
const siteRoutes = require('./site.route');
const shiftLogs = require('./shift.logs.route');
const controlCenter = require('./control.center.route');
const emergencyProcedure = require('./emergency.procedure.route');
const questionRoutes = require('./question.route');
const choiceRoutes = require('./choice.route');
const reportRoutes = require('./report.route');
const faqRoutes = require('./faq.route');
const guideRoutes = require('./guide.route');
const guardRoutes = require('./guard.route');
const admReportRoutes = require('./adminReport.route');
const admModules = require('./admin.module.route');
const admRoles = require('./admin.roles.routes');
const pageRoutes = require('./page.route');
const helpRoutes = require('./help.route');
const keyShiftDutyRoutes = require('./key.shift.duties.route');
const siteInductionRoutes = require('./site.specific.induction.route');
const userDocumentStatus = require('./user.document.status');
const requiredSkillAndExperienceRoutes = require('./required.skill.and.experience.route')
const taskRoutes = require('./task.route')
const visitorTaskRoutes = require('./visitor.task.route')
const visitorProfileRoutes = require('./visitor.profile.route')
const visitorBookRoutes = require('./visitor-book.route')
const visitorReasonRoutes = require('./visitor-reason.route')
const companyUserRoutes = require('./company.user.route')
const adminGuards = require('./guards.admin.route')
const companyAdminRoutes = require('./company.admin.route')
const reportTypeRoutes = require('./report.type.route')
const allReportTypeRoutes = require('./all.report.type.route')
const reportQuestionRoutes = require('./report.question.route')
const tenancyCheckRoute = require('./tenancy.check.routes')
const checkpointRoute = require('./site.checkpoints.route');
const rosterRoute = require('./site.roster.route');
const adminTimesheetRoutes = require('./adminTimesheet.route');
const safetyTipRoute = require('./safety.tips.route');
const alertsRoute = require('./alert.route');
const recurrenceRoute = require('./recurrence.type.route');
const exportRoute = require('./export.data.route');
const adminUserLicenseRoute = require('./user.license.route');

// user Api
const userAuthRoutes = require('./user/auth.route');
const visitorAuthRoutes = require('./visitor-auth.route');
const userProfileRoutes = require('./user/profile.route');
const userGpsSettingRoutes = require('./user/gps.setting.route');
const userLicenseRoutes = require('./user/license.route');
const userCvRoute = require('./user/cv.route');
const licenseTypesRoutes = require('./license.type.route');
const userSettingRoutes = require('./user/setting.route');
const userAvailabilityRoutes = require('./user/availability.route');
const userPaymentCardRoutes = require('./user/payment.card.route')
const userFaqRoutes = require('./user/faq.route')
const userPageRoutes = require('./user/page.route')
const userSupportRoutes = require('./user/support.request.route')
const userHelpRoutes = require('./user/help.route')
const userSupportMessageRoutes = require('./user/support.message.route')
const casualShiftRoute = require('./user/casual.shift.route')
const notificationRoute = require('./notification.route')
const dashboardRoute = require('./dashboard.route')
const userShiftRoutes = require('./user/shift.route')
const shiftTypeRoutes = require('./shift.type.route')
const userKeyShiftDutyRoutes = require('./user/key.shift.duties.route')
const userRequiredSkillAndExperienceRoutes = require('./user/required.skill.and.experience.route')
const userTaskRoutes = require('./user/task.route')
const userReportRoute = require('./user/user.report.route');
const receiptRoute = require('./receipt.route');
const alarmRoutes = require('./alarm.routes');
const adminLiscense = require('./admin.liscense.route');
const UserLocation = require('./user.location');
const adminUserRoutes = require('./admin.user.routes');
const companyAdminUserRoutes = require('./company.admin.user.routes')
const demoRoute = require('./demo.route');
const clientRoute = require('./client.route');
const dynamicRoute = require('./dynamic.site.overview.route');
const riskRoute = require('./risk.assessment.route');
const riskReportRoute = require('./risk.assessment.report.route');
const riskChoiceRoute = require('./risk.assessment.choice.route');
const riskOptionRoute = require('./risk.assessment.option.route');
const portfolioReportRoute = require('./portfolio.report.route');

// company
const companyAuthRoutes = require('./company/auth.route')
const companySiteRoutes = require('./company/site.route')
const companyTaskROutes = require('./company/task.route')
const companyShiftRoutes = require('./company/casual.shift.route')

// universal api
const reportCounties = require('./country.route');
const cityRoutes = require('./city.route');
const suburbs = require('./suburbs.route');
const homeRoutes = require('./home.route');
const universalCompaniesRoute = require('./all/company.route');
const universalRolesRoute = require('./all/role.route');
const companyAdminAuthRoute = require('./company-admin/auth.routes')
const universalSiteRoute = require('./all/site.route')
const universalUserRoute = require('./all/user.route')

// Company Admin Api
const companyAdminSiteRoutes = require('./company-admin/site.routes');

// import
const importRoutes = require('./import.route')
const router = express.Router();

// Status
router.get('/status', (req, res) => res.send('OK'));
// Docs
router.use('/docs', express.static('docs'));

// Export data Routes
router.use('/export/file', exportRoute);

// auth
router.use('/auth', authRoutes);
// admin role access
router.use('/users', userRoutes);
router.use('/trackers', trackerRoutes);
router.use('/timesheet-statuses', timesheetStatusRoutes);
router.use('/support-statuses', supportStatusRoutes);
router.use('/timesheet', timesheetRoutes);
router.use('/admin/timesheet', adminTimesheetRoutes);
router.use('/support', supportRoutes);
router.use('/roles', roleRoutes);
router.use('/companies', companyRoutes);
router.use('/vendors', vendorRoutes);
router.use('/vendor/clients', cleintMap);
router.use('/sites', siteRoutes);
router.use('/checkpoints', checkpointRoute);
router.use('/shift-logs', shiftLogs);
router.use('/safety-tips', safetyTipRoute);
router.use('/alerts', alertsRoute);
router.use('/recurrence', recurrenceRoute);
router.use('/control-center', controlCenter);
router.use('/emergency-procedure', emergencyProcedure);
router.use('/questions', questionRoutes);
router.use('/adm/liscense', adminLiscense);
router.use('/choices', choiceRoutes);
router.use('/reports', reportRoutes);
router.use('/faqs', faqRoutes);
router.use('/alarm', alarmRoutes);
router.use('/guide', guideRoutes);
router.use('/guards', guardRoutes);
router.use('/admin/guards', adminGuards);
router.use('/admin/reports', admReportRoutes);
router.use('/pages',pageRoutes);
router.use('/helps',helpRoutes);
router.use('/key-shift-duties',keyShiftDutyRoutes);
router.use('/shift-types',shiftTypeRoutes);
router.use('/user/site-specific-induction',siteInductionRoutes);
router.use('/user/docstatus',userDocumentStatus);
router.use('/required-skills-and-experiences',requiredSkillAndExperienceRoutes);
router.use('/tasks',taskRoutes);
router.use('/visitor-tasks',visitorTaskRoutes);
router.use('/visitor/profile',visitorProfileRoutes);
router.use('/visitor/book',visitorBookRoutes);
router.use('/visitor/reason',visitorReasonRoutes);
router.use('/company-users',companyUserRoutes);
router.use('/company-admin-users',companyAdminUserRoutes);
router.use('/admin/company-users',companyAdminRoutes);
router.use('/report-types', reportTypeRoutes);
router.use('/all-report-types', allReportTypeRoutes);
router.use('/report-questions', reportQuestionRoutes);
router.use('/tenancy-check', tenancyCheckRoute);
router.use('/adm/modules', admModules);
router.use('/adm/roles', admRoles);
router.use('/admin/admin-users', adminUserRoutes);
router.use('/admin/user-license',adminUserLicenseRoute);
router.use('/risk-assessment',riskRoute);
router.use('/risk-assessment-report', riskReportRoute);
router.use('/risk-assessment-question-choice', riskChoiceRoute);
router.use('/risk-assessment-choice-option', riskOptionRoute);
router.use('/portfolio-report', portfolioReportRoute);

// both
router.use('/company/clients', clientRoute);
router.use('/dynamic-site-overview-report', dynamicRoute);


// user apis
router.use('/user/auth',userAuthRoutes);
router.use('/visitor/auth',visitorAuthRoutes);
router.use('/visitor/profile',visitorAuthRoutes);
router.use('/user/receipt',receiptRoute);
router.use('/user/location',UserLocation);
router.use('/my/profile',userProfileRoutes);
router.use('/profile',userProfileRoutes);
router.use('/my/gps-setting',userGpsSettingRoutes);
router.use('/my/license',userLicenseRoutes);
router.use('/my/resume',userCvRoute);
router.use('/getlicense',licenseTypesRoutes);
router.use('/my/setting',userSettingRoutes);
router.use('/my/availability',userAvailabilityRoutes);
router.use('/my/payment-card',userPaymentCardRoutes);
router.use('/user/faqs',userFaqRoutes);
router.use('/user/pages',userPageRoutes);
router.use('/user/support-requests',userSupportRoutes);
router.use('/user/helps',userHelpRoutes);
router.use('/user/support-messages',userSupportMessageRoutes);
router.use('/user/shifts',userShiftRoutes);
router.use('/user/casual-shifts',casualShiftRoute);
router.use('/notifications',notificationRoute);
router.use('/admin/dashboard',dashboardRoute);
router.use('/user/key-shift-duties', userKeyShiftDutyRoutes);
router.use('/user/required-skills-and-experiences',userRequiredSkillAndExperienceRoutes);
router.use('/user/tasks', userTaskRoutes);
router.use('/user/reports', userReportRoute);
router.use('/user/home', homeRoutes);
router.use('/demo',demoRoute);

// company Api
router.use('/company/auth', companyAuthRoutes);
router.use('/company/sites',companySiteRoutes)
router.use('/company/tasks', companyTaskROutes)
router.use('/company/shifts',companyShiftRoutes )
router.use('/company/roster',rosterRoute )

// company admin api
router.use('/company-admin/auth', companyAdminAuthRoute);
router.use('/company-admin/sites',companyAdminSiteRoutes);

// universal api
router.use('/companies-list',universalCompaniesRoute);
router.use('/company-sites',universalSiteRoute);
router.use('/sites-user',universalUserRoute);
router.use('/companies-roles',universalRolesRoute);
router.use('/import/cities',importRoutes)
router.use('/countries', reportCounties);
router.use('/states', stateRoutes);
router.use('/cities', cityRoutes);
router.use('/suburbs', suburbs);

module.exports = router;
