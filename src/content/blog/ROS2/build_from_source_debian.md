---
title: "How to build & install ros2 from source on debian 12"
description: "A step by step guide."
pubDate: "10/31/2024"
updatedDate: "10/31/2024"
---

## OS

Debian 12 Bookworm

## Steps

1. Install build prerequisites.
```sh
sudo apt install -y git colcon python3-rosdep2 vcstool wget \
    python3-flake8-docstrings python3-pip python3-pytest-cov \
    python3-flake8-blind-except python3-flake8-builtins \
    python3-flake8-class-newline python3-flake8-comprehensions \
    python3-flake8-deprecated python3-flake8-import-order \
    python3-flake8-quotes python3-pytest-repeat libxaw7-dev \
    python3-pytest-rerunfailures python3-vcstools libacl1-dev \
    libtinyxml-dev libtinyxml2-dev ros-cmake-modules libasio-dev
```

2. Create workspace directory and get source code.
    - `mkdir -p ~/ros2_humble/src && cd ~/ros2_humble/`
    - `vcs import --input https://raw.githubusercontent.com/ros2/ros2/humble/ros2.repos src`
    - `sudo rm -f /etc/ros/rosdep/sources.list.d/20-default.list`
    - `sudo apt upgrade`
    - `sudo rosdep init`
    - `rosdep update`
    - `rosdep install --from-paths src --ignore-src -y --skip-keys "fastcdr rti-connext-dds-6.0.1 urdfdom_headers"`

Note: when you use rosdep install, you will counter an error about package python3-vcstool just don't care and continue for building.
This is due to package name change from python3-vcstool to python3-vcstools.

3. Compile!
```sh
colcon build --symlink-install
```

## Reference

https://www.reddit.com/r/ROS/comments/14axhdt/install_ros2_on_debian_12_and_ubuntu_23/
