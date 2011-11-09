<?php
##########
##
##	n.rios
##  06/28/2009
##
##########

class Core_Mysql{
	
	/**
	 * The DB Host to connect to
	 *
	 * @var string
	 */
	 var $host;
	
	/**
	 * The DB Username to access the host
	 *
	 * @var string
	 */
	 var $username;
	
	/**
	 * The DB Password to access the host
	 *
	 * @var string
	 */
	 var $password;
	
	/**
	 * The DB Name to use once connected
	 *
	 * @var string
	 */
	 var $database;
	
	/**
	 * The connection string once the connection is made
	 *
	 * @var resource
	 */
	 var $connection;
	
	 var $debug=0;
	
	/**
	 * The constructor to create a MySQL Database object
	 *
	 * @param string $host
	 * @param string $username
	 * @param string $password
	 * @param string $database
	 */
	function Core_Mysql($host, $username, $password, $database){
		$this->host = $host;
		$this->username = $username;
		$this->password = $password;
		$this->database = $database;
		
		$this->connection = @mysql_connect($this->host, $this->username, $this->password);
	
		if(!$this->connection){
			print "There was an error while connecting to the database.  Please verify that your settings are correct and that your database allows connections from this server.";
			print "<br />" . mysql_error();
			exit;
		}
		
		$this->selectDatabase();
	
	}
	
	/**
	 * Sets the debug flag
	 *
	 * @param int $debug
	 */
	function setDebug($debug){
		$this->debug = $debug;
	}
	
	
	
	function execute($query) {
		
		if($this->debug){
			print "<b>QUERY: $query</b><br />\n";
		}
		
		$result = mysql_query($query);
		
		if(!$result) return(null);
		
		$rows = array();
		$fields = array();
		while ($row = mysql_fetch_array($result, MYSQL_ASSOC)) {

			while($field = key($row)) {
				$fields[$field] = $row[$field];
				next($row);
			}
			$rows[] = $fields;

		}
		
		return($rows);
		
	}
	
	/**
	 * Run a select query on the database
	 *
	 * @param string $query
	 * @param string[] $columns An array of column names you want to name the multi-dimenstional array of selected values
	 * @param string[] $columns may also accept single or multi for array type
	 * @return string[][]
	 */
	function select($query, $columns=null){
		
		if($this->debug){
			print "<b>QUERY: $query</b><br />\n";
		}
		$result = mysql_query($query);
		if(!$result){
			return(null);
		}
		$results = array();
		
				if($columns=='obj'){
				
					$i=0;
					while ($line = mysql_fetch_object($result)) {
						foreach($line as $col => $val){
						$results[$i]->$col = $val;
							}
					$i++;
					}
				
				}
				if($columns=='multi'){
				
					$i=0;
					while ($line = mysql_fetch_array($result, MYSQL_ASSOC)) {
						foreach($line as $col => $val){
						$results[$i][$col] = $val;
							}
					$i++;
					}
				}
				if($columns=='single'){
					$line = mysql_fetch_array($result, MYSQL_ASSOC);
					if(count($line) > 0){
						foreach($line as $col => $val){
						$results[$col] = $val;
							}
					
					}
				}
				if($columns=='value'){
					$results = mysql_fetch_array($result);
					$results = $results[0];
				}
				if(empty($columns)){
					$i=0;
					while ($line = mysql_fetch_array($result, MYSQL_NUM)) {
					for($j=0; $j<sizeof($line); $j++){
						$results[] = $line[$j];
					}
					$i++;
					}
				}
				
				
		
		return($results);
	}
	
	/**
	 * Run a insert query on the database
	 *
	 * @param string $query
	 * @return int the last inserted id from the query
	 */
	function insert($query){
		
		if($this->debug){
			print "<b>QUERY: $query</b><br />\n";
		}
		
		$result = mysql_query($query);
		
		if(!$result){
			return(null);
		}
		
		$id = mysql_insert_id($this->connection);
		
		return($id);
	}
	
	/**
	 * Run an update query on the database
	 *
	 * @param string $query
	 * @return int the number of rows affected
	 */
	function update($query){
		if($this->debug){
			print "<b>QUERY: $query</b><br />\n";
		}
		
		$result = mysql_query($query);
		
		if(!$result){
			return(null);	
		}
		
		$id = mysql_affected_rows($this->connection);
		
		return($id);
	}
	
	/**
	 * Run a delete query on the database
	 *
	 * @param string $query
	 * @return int the number of rows affected
	 */
	function delete($query){
		if($this->debug){
			print "<b>QUERY: $query</b><br />\n";
		}
		
		$result = mysql_query($query);
		
		if(!$result){
			return(null);	
		}
		
		$id = mysql_affected_rows($this->connection);
		
		return($id);
	}
	
	/**
	 * Select the database this connection is currently using
	 *
	 */
	function selectDatabase(){
		if(!@mysql_select_db($this->database)){
			print "There was an error while selecting the database.  Please verify that your settings are correct and that your database allows connections from this server.";
			exit;
		}
	}
	
	/**
	 * The destructor used to close the connection on script exit
	 *
	 */
	function __destruct(){
		if($this->connection){
			mysql_close($this->connection);
		}
	}
	function closeDB(){
		if($this->connection){
			mysql_close($this->connection);
		}
	}
	
	/**
	 * Access the DB host
	 *
	 * @return string
	 */
	function getHost(){
		return($this->host);
	}
	
	/**
	 * Access the DB username
	 *
	 * @return string
	 */
	function getUsername(){
		return($this->username);
	}
	
	/**
	 * Access the DB password
	 *
	 * @return string
	 */
	function getPassword(){
		return($this->password);
	}
	
	/**
	 * Access the DB name
	 *
	 * @return unknown
	 */
	function getDatabase(){
		return($this->database);
	}
	
	/**
	 * Escape a string for mysql
	 * 
	 * @return string
	 */
	function escape($string) {
		if (get_magic_quotes_gpc()) {
			$string = stripslashes($string);
		}
		return mysql_real_escape_string($string);
	}
}


?>