
VALAC=/opt/gnome/bin/valac
VERSION=0.1

all: zoomy

zoomy: zoomy.gs
	${VALAC} --pkg gtk+-2.0 --pkg gdk-2.0 --pkg gdk-pixbuf-2.0 zoomy.gs

dist: zoomy
	cd ..; cp -r zoomy zoomy-${VERSION}; rm -rf zoomy-${VERSION}/.git; rm -f zoomy-${VERSION}/*~ zoomy-${VERSION}/*.o zoomy-${VERSION}/.*~ zoomy-${VERSION}/*.tar.gz; tar -czf zoomy/zoomy-${VERSION}.tar.gz zoomy-${VERSION}; rm -r zoomy-${VERSION}

clean:
	rm zoomy

