
// TURTLE STUFF:
var x, y; // the current position of the turtle
var currentangle = 270; // which way the turtle is pointing
var step = 20; // how much the turtle moves with each 'F'
var angle = 30; // how much the turtle turns with a '-' or '+'

// LINDENMAYER STUFF (L-SYSTEMS)
var thestring = 'F'; // "axiom" or start of the string
var numloops = 3; // how many iterations to pre-compute
var therules = []; // array for rules
therules[0] = ['F', 'F[-F]F[+F][F]']; // first rule
therules[1] = ['B', '+AF-BFB-FA+']; // second rule

// Brackets
var xstack = [] // stack for x coordinates
var ystack = [] // stack for y coordinates
var stackidx = 0
var x0
var y0
var anglestack = []

var whereinstring = 0; // where in the L-system are we?

function setup() {
  createCanvas(300, 300);
  background(255);
  stroke(0, 0, 0, 255);
  
  // start the x and y position at lower-left corner
  x = 150;
  x0 = 150;
  y = 300;
  y0 = 300;
  
  // COMPUTE THE L-SYSTEM
  for (var i = 0; i < numloops; i++) {
    thestring = lindenmayer(thestring);
  }
}

function draw() {
  
  // draw the current character in the string:
  drawIt(thestring[whereinstring]); 
  
  // increment the point for where we're reading the string.
  // wrap around at the end.
  whereinstring++;
  // if (whereinstring > thestring.length-1) whereinstring = 0;

}

// interpret an L-system
function lindenmayer(s) {
  var outputstring = ''; // start a blank output string
  
  // iterate through 'therules' looking for symbol matches:
  for (var i = 0; i < s.length; i++) {
    var ismatch = 0; // by default, no match
    for (var j = 0; j < therules.length; j++) {
      if (s[i] == therules[j][0])  {
        outputstring += therules[j][1]; // write substitution
        ismatch = 1; // we have a match, so don't copy over symbol
        break; // get outta this for() loop
      }
    }
    // if nothing matches, just copy the symbol over.
    if (ismatch == 0) outputstring+= s[i]; 
  }
  
  return outputstring; // send out the modified string
}

// this is a custom function that draws turtle commands
function drawIt(k) {

  if (k=='F') { // draw forward
    // polar to cartesian based on step and currentangle:
    var x1 = x + step*cos(radians(currentangle));
    var y1 = y + step*sin(radians(currentangle));
    line(x, y, x1, y1); // connect the old and the new

    // update the turtle's position:
    x = x1;
    y = y1;
    // give me some random color values:
    var r = random(128, 255);
    var g = random(0, 192);
    var b = random(0, 50);
    var a = random(50, 100);

    // pick a gaussian (D&D) distribution for the radius:
    var radius = 0;
    radius += random(0, 5);
    radius += random(0, 5);
    radius += random(0, 5);
    radius = radius/3;

    // draw the stuff:
    fill(r, g, b, a);
    rect(x - (radius/2), y - (radius/2), radius, radius);
  } else if (k == '+') {
    currentangle += angle; // turn left
  } else if (k == '-') {
    currentangle -= angle; // turn right   
  } else if (k == '[') {
    xstack[stackidx] = x;
    ystack[stackidx] = y;
    anglestack[stackidx] = currentangle
    // x = x0;
    // y = y0;
    stackidx++;
  } else if (k == ']') {
    stackidx--;
    x = xstack[stackidx]
    y = ystack[stackidx]
    currentangle = anglestack[stackidx]
  }


}