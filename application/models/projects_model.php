<?php
class Projects_model extends CI_Model {
    function __construct() {
        parent::__construct();
	$this->load->database();
    }
    function get_projects($limit = null) {
	$this->db->select('projects.*');
        $this->db->from('projects');
	if (isset($limit)) {
	    $this->db->limit($limit);
	}
	$this->db->order_by("status asc, start_date desc"); 
        $query = $this->db->get();
	return $query->result();
    }
}