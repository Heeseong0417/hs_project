import os
import sqlite3

################################################################################
# [[ SQLITE
class csqlite3:
    def __init__(self, name):
        self.file_path = name
        if False == (os.path.isfile(self.file_path)):
            self.con = sqlite3.connect(self.file_path)
            self.cur = self.con.cursor()
            self.cur.execute('''
    CREATE TABLE summary (
        total_count int,
        processed_count int,
        msg text
    )
            ''')
            self.cur.execute('''
    CREATE TABLE files (
        id integer primary key,
        filename text UNIQUE,
        state text,
        msg_schema_validation text,
        msg_value_validation text,
        msg text
    )
            ''')
            self.con.commit()
        else:
            self.con = sqlite3.connect(self.file_path)
            self.cur = self.con.cursor()

    def __del__(self):
        self.con.close()

    def summary_insert(self, total_file_count):
        msg = ""
        sql_text = "INSERT INTO summary (total_count, processed_count, msg) VALUES (" + str(total_file_count) + ", 0, '" + msg + "')"
        self.cur.execute(sql_text)
        self.con.commit()

    def summary_update(self):
        msg = ""
        sql_text = "UPDATE summary SET processed_count=processed_count+1"
        self.cur.execute(sql_text)
        self.con.commit()

    def file_insert(self, filename, state, msg_schema_validation, msg_value_validation, msg):
        msg = ""
        state = "processed"
        msg_schema_validation = msg_schema_validation.replace("'", "")
        msg_value_validation = msg_value_validation.replace("'", "")
        sql_text = "INSERT INTO files (filename, state, msg_schema_validation, msg_value_validation, msg) VALUES ('" \
            + filename + "', '" + state + "', '" + msg_schema_validation + "', '" + msg_value_validation + "', '" + state + "')"
        self.cur.execute(sql_text)
        self.con.commit()
        #result = self.cur.execute("SELECT * FROM files where filename='"+filename+"'")
        #for row in result:
        #    print(row)
        #count = len(self.cur.fetchall())
        #print(count)
        #if count > 0:
        #    sql_text = "UPDATE files SET state='" + state + "', msg='" + msg + "' WHERE filename='"+filename+"'"
        #else:
        #    sql_text = "INSERT INTO files VALUES ('" + filename + "', '" + state + "', '" + msg + "')"
        #print(sql_text)
        #self.cur.execute(sql_text)
        #self.con.commit()

# ]] SQLITE
################################################################################
