vitalius.github.com
===================

A Simple Static Site Generator.

### Goals and Features ###
 * Ability to host on a basic http server with no backend, such as S3.
  * Posts are written in JSON with linebreaks format. AngularJS allows http response filtering, where newlines are promptly removed making post a valid JSON feed.
 * Generate and edit content with a simple text editor.
  * No need for Ruby or Python environment, no "markup" either. Posts are written with HTML (Hyper Text _Markup_ Language).
 * Use as much off the shelf CSS/JS as possible.
  * Not a single custom CSS line. Everything is vanilla Bootstrap and AngularJS. Let other people worry about that IE compliance.
 * As simple as possible but not simpler.
  * All of the logic is contained in a relatively small js/ecstatic.js file. Three factories and two controller. That's it.
