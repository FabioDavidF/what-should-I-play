import sqlite3

def create_connection(db_file):
    """ create a database connection to the SQLite database
        specified by the db_file
    :param db_file: database file
    :return: Connection object or None
    """
    conn = None
    try:
        conn = sqlite3.connect(db_file)
    except Error as e:
        print(e)

    return conn

conn = create_connection('db.sqlite3')

def saving(conn):
    """
    Query all rows in the tasks table
    :param conn: the Connection object
    :return:
    """
    cur = conn.cursor()
    cur.execute("SELECT * FROM suggestions_game")

    rows = cur.fetchall()

    for row in rows:
        name = row[1]
        app_id = row[2]
        price = row[3]
        image = row[4]
        tags = row[5]
        description = row[6]

        game = Game(
            name=name,
            app_id=app_id,
            price=price,
            image=image,
            tags=tags,
            description=description
        )
        game.save()
    return HttpResponse(status=200)

saving(conn)