

# See documentation: http://yui.github.io/yuicompressor/


# Set the source directory
srcdir = public/vi-lab/js/

# Create the list of modules
js_files =  ${srcdir}jquery-1.11.2.min.js\
						${srcdir}bootstrap.min.js\
						${srcdir}markdown.js\
						${srcdir}jquery.colorbox-min.js\
						${srcdir}jquery-image-loader.js\
						${srcdir}db.js\
						${srcdir}typeahead.bundle.js\

									
#<script type='text/javascript' src='/vi-lab/js/vi2.highlight.js'></script


# Set css source directory
css_srcdir = public/vi-lab/css/

# Create the list of modules
css_files =   ${css_srcdir}bootstrap.min.css\
						${css_srcdir}colorbox.css\
						${css_srcdir}video-patterns.css\

					
    
# Bundle all of the modules into vi-two.js
js: ${js_files}
		cat $^ > public/vi-lab/js/video-patterns.js


#	Compress al of the modules into vi-two.min.js
js-min: ${js_files}
		cat $^ > public/vi-lab/js/video-patterns.js
	  java -jar /usr/bin/compiler.jar --js public/vi-lab/js/video-patterns.js --js_output_file public/vi-lab/js/video-patterns.min.js
#	  java -jar tools/yuicompressor-2.4.8.jar public/vi-lab/js/vi-two.js -o public/vi-lab/js/vi-two.min.js	   
		 
	  
# bundle css files
css: ${css_files}
	cat $^ > public/vi-lab/css/video-patterns-style.css


# bundle and compress css files
css-min: ${css_files}
	cat $^ > public/vi-lab/css/video-patterns-style.css
	java -jar ./_tools/yuicompressor-2.4.8.jar ./public/vi-lab/css/video-patterns-style.css -o public/vi-lab/css/video-patterns-style.min.css
	
   
	  

all:
	make css-min
	make js-min
	  
test:	${js_files}
	jshint $^ 
	
image: 
	for file in ./public/vi-lab/img/screenshots/*; do sudo jpgoptim --strip-all -q ${file}*.png; done;
	#image_optim ./public/vi-lab/img/screenshots/*.{jpg,png,gif,svg}	 
	  
	  
	  
	  
# generate documentation of vi-two
#	setup jsdoc:
# 1) JSDOCDIR="$HOME/Documents/www/elearning/vi2/vi-two/tools/jsdoc/jsdoc-toolkit"
# 2) JSDOCTEMPLATEDIR="$JSDOCDIR/templates/jsdoc"
# 3) make documentation
documentation: $(vi2)
		#cat $^ > vi2doc.js
		java -jar tools/jsdoc/jsdoc-toolkit/jsrun.jar tools/jsdoc/jsdoc-toolkit/app/run.js -a -t=tools/jsdoc/jsdoc-toolkit/templates/jsdoc $^ 
		# copy docs to the dedicated folder
		cp -r tools/jsdoc/jsdoc-toolkit/out/jsdoc/* doc/


#		
iwrm: ${modules}
		cat $^ > examples/iwrm/js/vi-two.js
	  java -jar /usr/bin/compiler.jar --js examples/iwrm/js/vi-two.js --js_output_file examples/iwrm/js/vi-two.min.js
		
	 
		
		
		
		
		 

