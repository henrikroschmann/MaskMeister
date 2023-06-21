# Change Log

### 2023-06-21
### Added
- Added a prefix 'MaskMeister: ' to all command names for a more streamlined experience when using the command shortcut (Ctrl+Shift+P on Windows). This will help users to easily find all the commands related to the MaskMeister extension.
- Extended the keyword matching functionality in JSON format. Now, it supports not just exact matches, but also partial matches and whole-word matches. This has been achieved by extending the JSON format for specifying keywords and adding an option to specify the type of match. This will help users find more relevant results when searching for keywords, thereby making the application more user-friendly and efficient.

### Fixed
- Fixed the issue with the 'getKeywordMap' function. Updated the function to accommodate the new JSON format for keyword matching. The function now correctly creates a Map of keywords to dummy values and match types, facilitating the enhanced keyword matching functionality.

### Changed
- Updated the code masking and unmasking logic to accommodate the new keyword matching functionality. The code now correctly masks and unmasks the code based on the type of keyword match specified, i.e., exact match, partial match, or whole-word match.

### Known Issues
- The application may not function as expected when the 'match_type' is not specified for a keyword in the JSON. This is being investigated and will be addressed in a future update.

---

All notable changes to the "maskmeister" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

- Initial release