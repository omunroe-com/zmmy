[indent=4]

uses
    Gtk
    Gdk
    GLib

init
    Gtk.init( ref args )
    var zoomy = new ZoomyWindow()
    zoomy.show_all()
    Gtk.main();



class ZoomyWindow : Gtk.Window

    prop pixbuf : Pixbuf
    prop scaled_pixbuf : Pixbuf
    prop img : Gtk.Image
    //prop pixbuf_width_over_height : double

    init
        title = "Zoomy"
        default_height = 250
        default_width = 250
        window_position = WindowPosition.CENTER

        destroy += Gtk.main_quit

        var vbox = new VBox( false, 0 )

        //var lbl = new Label( "Press ESC to exit" )
        //vbox.add( lbl )
        //vbox.set_child_packing( lbl, false, false, 0, PackType.START )

        pixbuf = new Pixbuf.from_file( "/home/andy/Desktop/Carys-Fish.jpg" )
        //pixbuf_width_over_height = (double)pixbuf.width / (double)pixbuf.height

        scaled_pixbuf = new Pixbuf( Colorspace.RGB, false, 8, pixbuf.width, pixbuf.height )

        img = new Gtk.Image.from_pixbuf( pixbuf )

        vbox.add( img )
        vbox.set_child_packing( img, true, true, 0, PackType.START )

        add( vbox )

        events |= EventMask.POINTER_MOTION_MASK

        motion_notify_event += mouse_move
        configure_event += config_evt

        key_press_event += def( obj, key )
            if key.keyval == 65307
                destroy()

        fullscreen()

    def mouse_move( obj : ZoomyWindow, evt : Gdk.Event ) : bool
        var height = 10 + (int)( evt.motion.y * 1.1 )

        var scale = (double)height / (double)obj.pixbuf.height
        scale = scale * scale * scale

        if scale < 0.01
            scale = 0.01

        var dest_width = (int)( obj.pixbuf.width * scale )
        var dest_height = (int)( obj.pixbuf.height * scale )

        if dest_width > obj.scaled_pixbuf.width
            dest_width = obj.scaled_pixbuf.width
        if dest_height > obj.scaled_pixbuf.height
            dest_height = obj.scaled_pixbuf.height

        obj.pixbuf.scale( obj.scaled_pixbuf, 0, 0, dest_width, dest_height, 0, 0, scale, scale, InterpType.NEAREST )

        var clipped_pixbuf = new Pixbuf.subpixbuf( obj.scaled_pixbuf, 0, 0, dest_width, dest_height )

        obj.img.set_from_pixbuf( clipped_pixbuf )
        obj.img.show()

        return true

    def config_evt( obj : ZoomyWindow, evt : Gdk.Event ) : bool
        obj.scaled_pixbuf = new Pixbuf( Colorspace.RGB, false, 8, evt.configure.width, evt.configure.height )

        return false


