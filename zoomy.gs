[indent=4]

/*
 *  Zoomy
 *  Copyright (C) 2008 Andy Balaam
 *
 *  This program is free software; you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation; either version 2 of the License, or
 *  (at your option) any later version.
 *
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, write to the Free Software
 *  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA  02111-1307  USA
**/

uses
    Gtk
    Gdk
    GLib

init
    Gtk.init( ref args )
    var zoomy = new ZoomyWindow()
    var success = zoomy.setup( args )

    if success
        zoomy.show_all()
        Gtk.main();


class ZoomyWindow : Gtk.Window

    prop pixbuf : Pixbuf
    prop scaled_pixbuf : Pixbuf
    prop img : Gtk.Image

    def setup( args : array of string ) : bool
        if args.length < 2
            print "Please supply the filename of the file to show"
            return false

        var image_filename = args[1]

        title = "Zoomy"
        default_height = 250
        default_width = 250
        window_position = WindowPosition.CENTER

        var black_col = Gdk.Color()
        black_col.red   = 0
        black_col.green = 0
        black_col.blue  = 0

        modify_bg( StateType.NORMAL, black_col )

        destroy += Gtk.main_quit

        var vbox = new VBox( false, 0 )

        try
            pixbuf = new Pixbuf.from_file( image_filename )
        except
            print "Could not open file '%s'", image_filename
            return false

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

        return true

    def mouse_move( obj : ZoomyWindow, evt : Gdk.Event ) : bool
        var height = 10 + (int)( evt.motion.y * 1.4 )

        var scale = (double)height / (double)obj.pixbuf.height
        scale = scale * scale * scale

        if scale < 0.01
            scale = 0.01

        var dest_width = (int)( obj.pixbuf.width * scale )
        var dest_height = (int)( obj.pixbuf.height * scale )

        var shift_x = 0
        var shift_y = 0
        if dest_width > obj.scaled_pixbuf.width
            var mult_x = evt.motion.x / (double)obj.scaled_pixbuf.width
            shift_x = (int)( mult_x * (double)( (obj.scaled_pixbuf.width - dest_width) ) )

        if dest_height > obj.scaled_pixbuf.height
            shift_y = (int)( (double)( (obj.scaled_pixbuf.height - dest_height) ) / 2.0 )

        if dest_width > obj.scaled_pixbuf.width
            dest_width = obj.scaled_pixbuf.width
        if dest_height > obj.scaled_pixbuf.height
            dest_height = obj.scaled_pixbuf.height

        obj.pixbuf.scale( obj.scaled_pixbuf, 0, 0, dest_width, dest_height, shift_x, shift_y, scale, scale, InterpType.NEAREST )

        var clipped_pixbuf = new Pixbuf.subpixbuf( obj.scaled_pixbuf, 0, 0, dest_width, dest_height )

        obj.img.set_from_pixbuf( clipped_pixbuf )
        obj.img.show()

        return true

    def config_evt( obj : ZoomyWindow, evt : Gdk.Event ) : bool
        obj.scaled_pixbuf = new Pixbuf( Colorspace.RGB, false, 8, evt.configure.width, evt.configure.height )

        return false


