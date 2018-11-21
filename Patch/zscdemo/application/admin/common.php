<?php

function int_to_string(&$data, $map = array('status' => array(1 => '正常', -1 => '删除', 0 => '禁用', 2 => '未审核', 3 => '草稿'))) {
	if ($data === false || $data === null) {
		return $data;
	}
	$data = (array) $data;
	foreach ($data as $key => $row) {
		foreach ($map as $col => $pair) {
			if (isset($row[$col]) && isset($pair[$row[$col]])) {
				$data[$key][$col . '_text'] = $pair[$row[$col]];
			}
		}
	}
	return $data;
}


function get_status_title($status = null) {
	if (!isset($status)) {
		return false;
	}
	switch ($status) {
	case -1:return '已删除';
		break;
	case 0:return '禁用';
		break;
	case 1:return '正常';
		break;
	case 2:return '待审核';
		break;
	default:return false;
		break;
	}
}

function show_status_op($status) {
	switch ($status) {
	case 0:return '启用';
		break;
	case 1:return '禁用';
		break;
	case 2:return '审核';
		break;
	default:return false;
		break;
	}
}

function get_action_type($type, $all = false) {
	$list = array(
		1 => '系统',
		2 => '用户',
	);
	if ($all) {
		return $list;
	}
	return $list[$type];
}

function get_action($id = null, $field = null) {
	if (empty($id) && !is_numeric($id)) {
		return false;
	}
	$list = cache('action_list');
	if (empty($list[$id])) {
		$map       = array('status' => array('gt', -1), 'id' => $id);
		$list[$id] = db('Action')->where($map)->field(true)->find();
	}
	return empty($field) ? $list[$id] : $list[$id][$field];
}