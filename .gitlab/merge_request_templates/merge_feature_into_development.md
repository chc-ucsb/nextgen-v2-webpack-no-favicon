# NextGen Merge Feature Into Development Request

### Developer Checklist
- [ ] I have tested in my development area. Link to area is [here](http:///).
- [ ] I will add the URL to this merge request to the Jira task.

### Affected Projects
<!-- Projects that have been affected by the changes -->
<!-- Do not include the brackets -->
- [Project Name] - @[lead]

### Source Code Location
<!-- Include the locations for each project that has been listed under Affected Projects -->
- [ ] Server Name: <Server Name>
- [ ] Directory: <Project> <Directory>

### Included Tasks
This merge request contains the following Jira tasks:
<!-- Link related tasks below -->
- [SCINEXTGV-XXXX](https://my.usgs.gov/jira/browse/SCINEXTGV-XXXX) - Task Description

### Requires Peer Review?
- [ ] No
- [ ] Yes - Tag everyone required to review
    - [ ] Jira task is in "Ready for Review" phase.
    <!-- Create a line for each person that needs to review it and tag them. -->
    - [ ] Reviewer @jamador has completed peer review.
    - [ ] Reviewer @ballu has completed peer review.

### Release Manager Checklist
- [ ] I have tested this change in the developer's area or by checking out the branch in my area.
- [ ] I have released the code by following the release steps below.

### Release Steps
<!-- Do these steps to build all the affected projects -->
1. Log into the server as defined in the Source Code Location.
2. Open GitBash as Admin.
3. `cd` to the directory as defined in the Source Code Location.
4. `git status` - make sure the branch is `development`
5. `git pull`
6. `npm run bundle -- --m dev --p <project names>`
7. Copy the contents of the `dist/` folder to the viewer area.

### Development Testing
- [ ] These changes have been tested in the development area and passed.
- [ ] Task has been moved to the "Ready for Release" phase.
