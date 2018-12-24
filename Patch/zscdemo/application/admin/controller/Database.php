<?php


namespace app\admin\controller;
use app\common\controller\Admin;

class Database extends Admin {

	public function index($type = null) {
		switch ($type) {
		/* 数据还原 */
		case 'import':
			//列出备份文件列表
			$path = config('data_backup_path');
			if (!is_dir($path)) {
				mkdir($path, 0755, true);
			}
			$path = realpath($path);
			$flag = \FilesystemIterator::KEY_AS_FILENAME;
			$glob = new \FilesystemIterator($path, $flag);

			$list = array();
			foreach ($glob as $name => $file) {
				if (preg_match('/^\d{8,8}-\d{6,6}-\d+\.sql(?:\.gz)?$/', $name)) {
					$name = sscanf($name, '%4s%2s%2s-%2s%2s%2s-%d');

					$date = "{$name[0]}-{$name[1]}-{$name[2]}";
					$time = "{$name[3]}:{$name[4]}:{$name[5]}";
					$part = $name[6];

					if (isset($list["{$date} {$time}"])) {
						$info         = $list["{$date} {$time}"];
						$info['part'] = max($info['part'], $part);
						$info['size'] = $info['size'] + $file->getSize();
					} else {
						$info['part'] = $part;
						$info['size'] = $file->getSize();
					}
					$extension        = strtoupper(pathinfo($file->getFilename(), PATHINFO_EXTENSION));
					$info['compress'] = ($extension === 'SQL') ? '-' : $extension;
					$info['time']     = strtotime("{$date} {$time}");

					$list["{$date} {$time}"] = $info;
				}
			}
			$title = '数据还原';
			break;
		/* 数据备份 */
		case 'export':
			$Db    = \think\Db::connect();
			$list  = $Db->query('SHOW TABLE STATUS');
			$list  = array_map('array_change_key_case', $list);
			$title = '数据备份';
			break;
		default:
			return $this->error('参数错误！');
		}
		//渲染模板
		$this->setMeta($title);
		$this->assign('list', $list);
		return $this->fetch($type);
	}
		public function optimize($tables = null) {
		if ($tables) {
			$Db = \think\Db::connect();
			if (is_array($tables)) {
				$tables = implode('`,`', $tables);
				$list   = $Db->query("OPTIMIZE TABLE `{$tables}`");

				if ($list) {
					return $this->success("数据表优化完成！");
				} else {
					return $this->error("数据表优化出错请重试！");
				}
			} else {
				$list = $Db->query("OPTIMIZE TABLE `{$tables}`");
				if ($list) {
					return $this->success("数据表'{$tables}'优化完成！");
				} else {
					return $this->error("数据表'{$tables}'优化出错请重试！");
				}
			}
		} else {
			return $this->error("请指定要优化的表！");
		}
	}

	public function repair($tables = null) {
		if ($tables) {
			$Db = \think\Db::connect();
			if (is_array($tables)) {
				$tables = implode('`,`', $tables);
				$list   = $Db->query("REPAIR TABLE `{$tables}`");

				if ($list) {
					return $this->success("数据表修复完成！");
				} else {
					return $this->error("数据表修复出错请重试！");
				}
			} else {
				$list = $Db->query("REPAIR TABLE `{$tables}`");
				if ($list) {
					return $this->success("数据表'{$tables}'修复完成！");
				} else {
					return $this->error("数据表'{$tables}'修复出错请重试！");
				}
			}
		} else {
			return $this->error("请指定要修复的表！");
		}
	}

	public function del($time = 0) {
		if ($time) {
			$name = date('Ymd-His', $time) . '-*.sql*';
			$path = realpath(config('DATA_BACKUP_PATH')) . DIRECTORY_SEPARATOR . $name;
			array_map("unlink", glob($path));
			if (count(glob($path))) {
				return $this->error('备份文件删除失败，请检查权限！');
			} else {
				return $this->success('备份文件删除成功！');
			}
		} else {
			return $this->error('参数错误！');
		}
	}	

	public function export($tables = null, $id = null, $start = null) {
		if (IS_POST && !empty($tables) && is_array($tables)) {
			//初始化
			$path = config('data_backup_path');
			if (!is_dir($path)) {
				mkdir($path, 0755, true);
			}
			//读取备份配置
			$config = array('path' => realpath($path) . DIRECTORY_SEPARATOR, 'part' => config('data_backup_part_size'), 'compress' => config('data_backup_compress'), 'level' => config('data_backup_compress_level'));
			//检查是否有正在执行的任务
			$lock = "{$config['path']}backup.lock";
			if (is_file($lock)) {
				return $this->error('检测到有一个备份任务正在执行，请稍后再试！');
			} else {
				//创建锁文件
				file_put_contents($lock, time());
			}
			//检查备份目录是否可写
			if (!is_writeable($config['path'])) {
				return $this->error('备份目录不存在或不可写，请检查后重试！');
			}
			session('backup_config', $config);
			//生成备份文件信息
			$file = array('name' => date('Ymd-His', time()), 'part' => 1);
			session('backup_file', $file);
			//缓存要备份的表
			session('backup_tables', $tables);
			//创建备份文件
			$Database = new \com\Database($file, $config);
			if (false !== $Database->create()) {
				$tab = array('id' => 0, 'start' => 0);
				return $this->success('初始化成功！', '', array('tables' => $tables, 'tab' => $tab));
			} else {
				return $this->error('初始化失败，备份文件创建失败！');
			}
		} elseif (IS_GET && is_numeric($id) && is_numeric($start)) {
			//备份数据
			$tables = session('backup_tables');
			//备份指定表
			$Database = new \com\Database(session('backup_file'), session('backup_config'));
			$start    = $Database->backup($tables[$id], $start);
			if (false === $start) {
				//出错
				return $this->error('备份出错！');
			} elseif (0 === $start) {
				//下一表
				if (isset($tables[++$id])) {
					$tab = array('id' => $id, 'start' => 0);
					return $this->success('备份完成！', '', array('tab' => $tab));
				} else {
					//备份完成，清空缓存
					unlink(session('backup_config.path') . 'backup.lock');
					session('backup_tables', null);
					session('backup_file', null);
					session('backup_config', null);
					return $this->success('备份完成！');
				}
			} else {
				$tab  = array('id' => $id, 'start' => $start[0]);
				$rate = floor(100 * ($start[0] / $start[1]));
				return $this->success("正在备份...({$rate}%)", '', array('tab' => $tab));
			}
		} else {
			//出错
			return $this->error('参数错误！');
		}
	}		

}	