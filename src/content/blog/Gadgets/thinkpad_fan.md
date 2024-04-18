---
title: "How to control thinkpad fan in Linux"
description: "with a simple shell command"
pubDate: "04/18/2024"
updatedDate: "04/18/2024"
---

## Environment

OS: Debian 12
Machine: Thinkpad T14 Gen1, Intel

## Steps

1. Put line `options thinkpad_acpi fan_control=1` into `/etc/modprobe.d/thinkpad_acpi.conf`
(you might need to create this file first), or with the following command.
```sh
echo 'options thinkpad_acpi fan_control=1' | sudo tee -a /etc/modprobe.d/thinkpad_acpi.conf
```
2. Try some of these and see if they work.
```sh
echo level 0 | sudo tee /proc/acpi/ibm/fan           # fan off
echo level 2 | sudo tee /proc/acpi/ibm/fan           # low speed
echo level 4 | sudo tee /proc/acpi/ibm/fan           # medium speed
echo level 7 | sudo tee /proc/acpi/ibm/fan           # maximum speed
echo level auto | sudo tee /proc/acpi/ibm/fan        # automatic - default
echo level disengaged | sudo tee /proc/acpi/ibm/fan  # disengaged
```
3. Then you can create your own shell command for controlling the fan speed.
```sh
fullspeed_fan() {
  echo "level 7" | sudo tee /proc/acpi/ibm/fan
}
autospeed_fan() {
  echo "level auto" | sudo tee /proc/acpi/ibm/fan
}
```


## Related Links

- https://blog.monosoul.dev/2021/10/17/how-to-control-thinkpad-p14s-fan-speed-in-linux/
- [The thinkpad-acpi kernel module manual](https://www.kernel.org/doc/Documentation/laptops/thinkpad-acpi.txt)
- [This thinkwiki page](https://www.thinkwiki.org/wiki/How_to_control_fan_speed)
- [This Ask-Ubuntu thread](https://askubuntu.com/questions/1048379/tee-proc-acpi-ibm-fan-invalid-argument)

