# Jon-Trombone
*A poor use case for vocal synthesis*

Demo at [joncole.me/pages/jon-trombone](http://www.joncole.me/pages/jon-trombone).

# Introduction
> I've always wanted to be a web app!

This nonsense uses Three.js to show a 3D scanned model of me, which is animated to have
a flapping jaw, which may or may not reflect reality. A modified version of
[Pink Trombone](https://dood.al/pinktrombone/) is used to synthesize vocals 
to match the movement of the jaw.

It comes with really, really basic MIDI parsing and playback. Someday I'll
update this with support for multiple voices. If you want to try out a MIDI
file of your own, just drag it onto my head.


# Build Instructions
I can't imagine why you'd want to do this, but you can build this yourself with a
few simple commands. It's a Node project, so all you need to do is run 
`node install` in the root, and then you can use the following Gulp tasks 
(e.g. `gulp build`):

* `build` - Builds the project into [/dist](/dist/)
* `preview` - Builds and presents the project's test page (live reloads)

Everything you need to run is in [/dist](/dist/). For an example
of an integration, see the [test page](/testpage/index.html). 

Jon-Trombone will use [Guify](https://github.com/colejd/guify) if it's available to give you a way to fiddle with the parameters.


# Credit
- Vocal synthesis code based on [Pink Trombone](https://dood.al/pinktrombone/)
- Test MIDI comes from [here](http://www.vgmusic.com/file/04c49ca1e71a4d0cf0c56cf3d9033cdd.html).


# License
MIT License. See [license.md](license.md) for details.