
VALAC=/opt/gnome/bin/valac

all: zoomy

zoomy: zoomy.gs
	${VALAC} --pkg gtk+-2.0 zoomy.gs


