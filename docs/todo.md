# Todo

This list tracks approved or active work.

## In progress
- [ ] Validate the advisor wording for retirement-oriented recommendations
- [ ] Review portfolio migration compatibility for existing users with older personal/family state
- [ ] Verify that the macro dashboard sources return current data in production
- [ ] Document the actual endpoints used by API calls
- [ ] Validate the Vercel + Supabase production flow end to end, including auth, persistence, advisor, and macro refresh



## Pending
- [ ] Review onboarding copy for main vs retirement bucket setup
- [ ] Improve recovery UX for reset-password and account editing flows
- [ ] Consider portfolio export and backup support
- [ ] Move the static site to a dedicated branch and make the dynamic app the main branch
- [ ] Add automated smoke tests for login, portfolio persistence, advisor responses, and indicator fallback behavior
- [ ] Update or archive the legacy local-only product specification so it matches the Supabase/Vercel architecture
- [ ] Complete production security hardening before public launch
- [ ] Promote current branch to main. 
- [ ] Create a demo branch. Dummy data. 
- [ ] Close privacy of current repo.
- [ ] Improve privacy and security and write a secury stanza document for new users. 
- [ ] asses monetizing strategy. create a folder for tha topic. 


## Performance ideas
- [ ] Debounce and coalesce Supabase state saves so rapid UI changes produce one write instead of a queue of snapshots
- [ ] Refresh shared macro data on a schedule and let clients read the cached result instead of asking each client to refresh providers
- [ ] Add bounded concurrency and short timeouts to market-data requests so a slow provider does not occupy the serverless function
- [ ] Split the dashboard script into feature modules and lazy-load Advisor and Indicators code when their tabs are opened
- [ ] Measure the dashboard startup path and avoid duplicate localStorage parsing and full-list rendering where practical

## Completed
- [x] Added two portfolio buckets: Main and 2050
- [x] Added user-created portfolios with custom names beyond Main and 2050
- [x] Enabled cross-portfolio goal linking for selected assets
- [x] Added the macro indicators dashboard and shared `macro_data` refresh flow
- [x] Made indicator refresh resilient to individual provider failures and cached-data fallback
- [x] Moved Indicators after Advisor IA in the primary navigation
- [x] Completed a frontend and serverless-handler dry run and commented out confirmed dead code
- [x] Added a consistent coin favicon to the login and dashboard browser tabs
- [x] Updated documentation index and design notes
- [x] Kept docs aligned with current implementation status
