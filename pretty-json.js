/*!
 * PrettyJSON JavaScript Library v1.0
 * github.com/peterbrescia/PrettyJSON
 *
 * Author: Peter Brescia
 * Released under the MIT license
 */

/**
 * Main function that prettifies your JSON and returns it as a string. Works best if you 
 * wrap the output in a <pre>.
 * Arguments:
 *   - json: (required):   JavaScript object OR JSON-encoded string
 *   - spacing (optional): tab width of output. Defaults to 2.
 *   - colors (optional):  pass an object mapping data types to colors to override the 
 *                         defaults. Data types are: string, number, boolean, null, key.
 */
function prettify(json, spacing, colors) {
    if (!spacing) {
        spacing = 2;
    };
    colorize(colors);

    if (typeof json != 'string') {
        json = JSON.stringify(json);
    }
    //Sanitize HTML special characters.
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    json = JSON.parse(json);

    return format(json, spacing);

    function format(json, spacing) {
        return '{\n'+iterate(json, spacing, spacing)+'}';
    }

    function iterate(obj, spacing, startingIndentation) {
        var cls,
            string = '';
        for (var property in obj) {
            cls = typeof obj[property];
            if (obj[property] === null) {
                //NULL has its own logic here because `typeof null` returns "object".
                string += spaces(startingIndentation)+'<span class="pretty-json-key">'+property+'</span>'+': <span class="pretty-json-null">NULL</span>\n';
            }
            else if (cls == 'object') {
                string += spaces(startingIndentation)+'<span class="pretty-json-key">'+property+'</span>'+': {\n';
                nestedIndentation = startingIndentation + spacing;
                string += iterate(obj[property], spacing, nestedIndentation);
                string += spaces(startingIndentation)+'}\n';
            }
            else if (cls == 'string') {
                //Add in quotes around the span to make it more obvious that the span contains a string.
                string += spaces(startingIndentation)+'<span class="pretty-json-key">'+property+'</span>'+': "<span class="pretty-json-'+cls+'">'+obj[property]+'</span>"\n';
            }
            else {
                string += spaces(startingIndentation)+'<span class="pretty-json-key">'+property+'</span>'+': <span class="pretty-json-'+cls+'">'+obj[property]+'</span>\n';
            }
        }
        return string;
    }

    /**
     * Returns an n-length string of non-breaking spaces.
     */
    function spaces(n) {
        var string= '';
        for (var i = 0; i < n; i++) {
            string += '&nbsp;';
        };
        return string;
    }

    /**
     * Writes stylesheet to the page.
     * Takes the `colors` object passed as an argument into prettify() (if any), and overwrites
     * the defaults with them.
     */
    function colorize(customColors) {
        var colors = {
                'string': 'green',
                'number': 'darkorange',
                'boolean': 'blue',
                'null': 'magenta',
                'key': 'red'
            };

        if (customColors) {
            for (var dataType in customColors) {
                colors[dataType] = customColors[dataType];
            };
        };

        var style = '<style>';
        for (var dataType in colors) {
            style += '.pretty-json-'+dataType+' {color: '+colors[dataType]+';}';
        };
        style += '</style>';
        $('body').append(style);
    }
}
