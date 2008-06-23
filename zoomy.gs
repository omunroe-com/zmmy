[indent=4]

uses 
    Gtk
    
init 
    Gtk.init( ref args )
    var zoomy = new ZoomyWindow()
    zoomy.show_all()
    Gtk.main();



class ZoomyWindow : Window

    init
        title = "Zoomy"
        default_height = 250
        default_width = 250
        window_position = WindowPosition.CENTER

        destroy += Gtk.main_quit

        var img = new Image.from_file( "/home/andy/Desktop/Carys-Fish.jpg" )
        add( img )

        key_press_event += def( obj, key )
            if key.keyval == 65307
                destroy()

        fullscreen()

