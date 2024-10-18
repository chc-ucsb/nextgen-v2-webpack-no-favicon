# NextGen Merge Development Into Master Request

### Version Number
<!-- Version number for release -->
vX.Y.Z

### Affected Projects
<!-- Projects that have been affected by the changes -->
<!-- Do not include the brackets -->
- [Project Name] - @[lead]

### Included Tasks
This merge request contains the following Jira tasks:
<!-- Link related tasks below -->
- [SCINEXTGV-XXXX](https://my.usgs.gov/jira/browse/SCINEXTGV-XXXX) - Task Description

### Developer Checklist
- [ ] I have tested in main development area. Link to area is [here](http:///).
- [ ] I will add the URL to this merge request to the Jira task.

### Source Code Location
<!-- Include the locations for each project that has been listed under Affected Projects -->
<!-- Include stage location if applicable -->
- [ ] Server Name: <Server Name>
- [ ] Directory: <Project> <Directory>

### Release Manager Checklist
- [ ] I have tested this change in the developer's area or by checking out the branch in my area.
- [ ] I have bumped the version number by following the pre-release steps below.
- [ ] I have released the code by following the release steps below.

### Pre-Release Steps
1. Bump the version listed in `package.json` to match the release version.
2. Commit the change to the `development` branch.

### Release Steps
1. Assign the version to the Jira tasks - Create the version if it's not already created.
2. Accept the merge request from `development` into `master`.
3. If a stage area exists, include steps to release to stage.
4. Create a tag in GitLab from the Tag Release Steps below.
5. Post a message in the NextGen channel on Teams with the message `<Tag> <URL> - This version is ready to be released. Leads - please release.`
6. Wait to hear back from the leads.
7. Update the Released Versions wiki page in GitLab, linking the versions to their associated tag.
8. Post a message in the NextGen channel on Teams with a link to the updated wiki document.

### Tag Release Steps
<!-- Do these steps to build all the affected projects -->
1. Log into the server as defined in the Source Code Location.
2. Open GitBash as Admin.
3. `cd` to the directory as defined in the Source Code Location.
4. `git status` - make sure the branch is `development`
5. `git pull`
6. `npm run bundle -- --p <project names>`
7. Copy the contents of the `dist/` folder to the viewer area.

### Stage Testing (If Applicable)
- [ ] These changes have been tested in the stage area and passed.
- [ ] Task has been moved to the "Ready for Release" phase.
