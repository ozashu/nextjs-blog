---
title: "mikanos-buildのansibleが失敗する"
date: "2022-08-08"
---

腐っているのか、古いパッケージを見に行き404で失敗する。
環境構築はDockerしか勝たん
どう突破すればいいのやら。
mikanOS の道のりは険しい

環境はWSL2のUbuntu20.04.3LTS

```
cat /etc/os-release
NAME="Ubuntu"
VERSION="20.04.3 LTS (Focal Fossa)"
ID=ubuntu
ID_LIKE=debian
PRETTY_NAME="Ubuntu 20.04.3 LTS"
VERSION_ID="20.04"
HOME_URL="https://www.ubuntu.com/"
SUPPORT_URL="https://help.ubuntu.com/"
BUG_REPORT_URL="https://bugs.launchpad.net/ubuntu/"
PRIVACY_POLICY_URL="https://www.ubuntu.com/legal/terms-and-policies/privacy-policy"
VERSION_CODENAME=focal
UBUNTU_CODENAME=focal
```

Ansibleのエラーメッセージ

```
TASK [ensure development tools are at the latest version] ********************************************************************************************************************************************************************************************************************
fatal: [localhost]: FAILED! => {"cache_update_time": 1659861544, "cache_updated": false, "changed": false, "msg": "'/usr/bin/apt-get -y -o \"Dpkg::Options::=--force-confdef\" -o \"Dpkg::Options::=--force-confold\"      install 'llvm-7-dev' 'lld-7' 'clang-7' 'nasm' 'acpica-tools' 'uuid-dev' 'qemu-system-x86' 'qemu-utils' -o APT::Install-Recommends=no' failed: E: Failed to fetch http://archive.ubuntu.com/ubuntu/pool/main/c/ceph/librados2_15.2.14-0ubuntu0.20.04.2_amd64.deb  404  Not Found [IP: 185.125.190.36 80]\n
E: Failed to fetch http://archive.ubuntu.com/ubuntu/pool/main/c/ceph/librbd1_15.2.14-0ubuntu0.20.04.2_amd64.deb  404  Not Found [IP: 185.125.190.36 80]\n
E: Failed to fetch http://security.ubuntu.com/ubuntu/pool/main/q/qemu/qemu-block-extra_4.2-3ubuntu6.21_amd64.deb  404  Not Found [IP: 185.125.190.36 80]\n
E: Failed to fetch http://security.ubuntu.com/ubuntu/pool/main/q/qemu/qemu-system-common_4.2-3ubuntu6.21_amd64.deb  404  Not Found [IP: 185.125.190.36 80]\n
E: Failed to fetch http://security.ubuntu.com/ubuntu/pool/main/q/qemu/qemu-system-data_4.2-3ubuntu6.21_all.deb  404  Not Found [IP: 185.125.190.36 80]\n
E: Failed to fetch http://security.ubuntu.com/ubuntu/pool/main/q/qemu/qemu-system-x86_4.2-3ubuntu6.21_amd64.deb  404  Not Found [IP: 185.125.190.36 80]\n
E: Failed to fetch http://security.ubuntu.com/ubuntu/pool/main/q/qemu/qemu-utils_4.2-3ubuntu6.21_amd64.deb  404  Not Found [IP: 185.125.190.36 80]\n
E: Unable to fetch some archives, maybe run apt-get update or try with --fix-missing?\n
", "rc": 100, "stderr": "E: Failed to fetch http://archive.ubuntu.com/ubuntu/pool/main/c/ceph/librados2_15.2.14-0ubuntu0.20.04.2_amd64.deb  404  Not Found [IP: 185.125.190.36 80]\n
E: Failed to fetch http://archive.ubuntu.com/ubuntu/pool/main/c/ceph/librbd1_15.2.14-0ubuntu0.20.04.2_amd64.deb  404  Not Found [IP: 185.125.190.36 80]\n
E: Failed to fetch http://security.ubuntu.com/ubuntu/pool/main/q/qemu/qemu-block-extra_4.2-3ubuntu6.21_amd64.deb  404  Not Found [IP: 185.125.190.36 80]\n
E: Failed to fetch http://security.ubuntu.com/ubuntu/pool/main/q/qemu/qemu-system-common_4.2-3ubuntu6.21_amd64.deb  404  Not Found [IP: 185.125.190.36 80]\n
E: Failed to fetch http://security.ubuntu.com/ubuntu/pool/main/q/qemu/qemu-system-data_4.2-3ubuntu6.21_all.deb  404  Not Found [IP: 185.125.190.36 80]\n
E: Failed to fetch http://security.ubuntu.com/ubuntu/pool/main/q/qemu/qemu-system-x86_4.2-3ubuntu6.21_amd64.deb  404  Not Found [IP: 185.125.190.36 80]\n
E: Failed to fetch http://security.ubuntu.com/ubuntu/pool/main/q/qemu/qemu-utils_4.2-3ubuntu6.21_amd64.deb  404  Not Found [IP: 185.125.190.36 80]\n
E: Unable to fetch some archives, maybe run apt-get update or try with --fix-missing?\n
", "stderr_lines": ["E: Failed to fetch http://archive.ubuntu.com/ubuntu/pool/main/c/ceph/librados2_15.2.14-0ubuntu0.20.04.2_amd64.deb  404  Not Found [IP: 185.125.190.36 80]", "E: Failed to fetch http://archive.ubuntu.com/ubuntu/pool/main/c/ceph/librbd1_15.2.14-0ubuntu0.20.04.2_amd64.deb  404  Not Found [IP: 185.125.190.36 80]", "E: Failed to fetch http://security.ubuntu.com/ubuntu/pool/main/q/qemu/qemu-block-extra_4.2-3ubuntu6.21_amd64.deb  404  Not Found [IP: 185.125.190.36 80]", "E: Failed to fetch http://security.ubuntu.com/ubuntu/pool/main/q/qemu/qemu-system-common_4.2-3ubuntu6.21_amd64.deb  404  Not Found [IP: 185.125.190.36 80]", "E: Failed to fetch http://security.ubuntu.com/ubuntu/pool/main/q/qemu/qemu-system-data_4.2-3ubuntu6.21_all.deb  404  Not Found [IP: 185.125.190.36 80]", "E: Failed to fetch http://security.ubuntu.com/ubuntu/pool/main/q/qemu/qemu-system-x86_4.2-3ubuntu6.21_amd64.deb  404  Not Found [IP: 185.125.190.36 80]", "E: Failed to fetch http://security.ubuntu.com/ubuntu/pool/main/q/qemu/qemu-utils_4.2-3ubuntu6.21_amd64.deb  404  Not Found [IP: 185.125.190.36 80]", "E: Unable to fetch some archives, maybe run apt-get update or try with --fix-missing?"], "stdout": "Reading package lists...\n
Building dependency tree...\n
Reading state information...\n
The following packages were automatically installed and are no longer required:\n
  golang-1.13 golang-1.13-doc golang-1.13-go golang-1.13-race-detector-runtime\n
  golang-1.13-src golang-doc golang-go golang-race-detector-runtime golang-src\n
  liblua5.2-0 libnl-genl-3-200 libqt5multimedia5 libqt5multimedia5-plugins\n
  libqt5multimediagsttools5 libqt5multimediawidgets5 libqt5opengl5 libsbc1\n
  libsmi2ldbl libsnappy1v5 libspandsp2 libspeexdsp1 libssh-gcrypt-4\n
  libwireshark-data libwireshark13 libwiretap10 libwsutil11 pkg-config\n
  wireshark-common wireshark-qt\n
Use 'sudo apt autoremove' to remove them.\n
The following additional packages will be installed:\n
  acl ipxe-qemu ipxe-qemu-256k-compat-efi-roms libboost-iostreams1.71.0\n
  libboost-thread1.71.0 libbrlapi0.7 libcacard0 libclang-common-7-dev\n
  libclang1-7 libfdt1 libibverbs1 libiscsi7 libllvm7 libpcsclite1 libpmem1\n
  librados2 librbd1 librdmacm1 libslirp0 libspice-server1 libusbredirparser1\n
  libuuid1 libvirglrenderer1 llvm-7 llvm-7-runtime qemu-block-extra\n
  qemu-system-common qemu-system-data seabios\n
Suggested packages:\n
  pcscd gstreamer1.0-plugins-ugly samba vde2 debootstrap\n
Recommended packages:\n
  libomp-7-dev ibverbs-providers gstreamer1.0-plugins-good qemu-system-gui\n
  ovmf cpu-checker sharutils\n
The following NEW packages will be installed:\n
  acl acpica-tools clang-7 ipxe-qemu ipxe-qemu-256k-compat-efi-roms\n
  libboost-iostreams1.71.0 libboost-thread1.71.0 libbrlapi0.7 libcacard0\n
  libclang-common-7-dev libclang1-7 libfdt1 libibverbs1 libiscsi7 libllvm7\n
  libpcsclite1 libpmem1 librados2 librbd1 librdmacm1 libslirp0\n
  libspice-server1 libusbredirparser1 libvirglrenderer1 lld-7 llvm-7\n
  llvm-7-dev llvm-7-runtime nasm qemu-block-extra qemu-system-common\n
  qemu-system-data qemu-system-x86 qemu-utils seabios uuid-dev\n
The following packages will be upgraded:\n
  libuuid1\n
1 upgraded, 36 newly installed, 0 to remove and 103 not upgraded.\n
Need to get 14.2 MB/74.9 MB of archives.\n
After this operation, 429 MB of additional disk space will be used.\n
Err:1 http://archive.ubuntu.com/ubuntu focal-updates/main amd64 librados2 amd64 15.2.14-0ubuntu0.20.04.2\n
  404  Not Found [IP: 185.125.190.36 80]\n
Err:2 http://archive.ubuntu.com/ubuntu focal-updates/main amd64 librbd1 amd64 15.2.14-0ubuntu0.20.04.2\n
  404  Not Found [IP: 185.125.190.36 80]\n
Ign:3 http://archive.ubuntu.com/ubuntu focal-updates/main amd64 qemu-block-extra amd64 1:4.2-3ubuntu6.21\n
Ign:4 http://archive.ubuntu.com/ubuntu focal-updates/main amd64 qemu-system-common amd64 1:4.2-3ubuntu6.21\n
Ign:5 http://archive.ubuntu.com/ubuntu focal-updates/main amd64 qemu-system-data all 1:4.2-3ubuntu6.21\n
Ign:6 http://archive.ubuntu.com/ubuntu focal-updates/main amd64 qemu-system-x86 amd64 1:4.2-3ubuntu6.21\n
Ign:7 http://archive.ubuntu.com/ubuntu focal-updates/main amd64 qemu-utils amd64 1:4.2-3ubuntu6.21\n
Err:3 http://security.ubuntu.com/ubuntu focal-updates/main amd64 qemu-block-extra amd64 1:4.2-3ubuntu6.21\n
  404  Not Found [IP: 185.125.190.36 80]\n
Err:4 http://security.ubuntu.com/ubuntu focal-updates/main amd64 qemu-system-common amd64 1:4.2-3ubuntu6.21\n
  404  Not Found [IP: 185.125.190.36 80]\n
Err:5 http://security.ubuntu.com/ubuntu focal-updates/main amd64 qemu-system-data all 1:4.2-3ubuntu6.21\n
  404  Not Found [IP: 185.125.190.36 80]\n
Err:6 http://security.ubuntu.com/ubuntu focal-updates/main amd64 qemu-system-x86 amd64 1:4.2-3ubuntu6.21\n
  404  Not Found [IP: 185.125.190.36 80]\n
Err:7 http://security.ubuntu.com/ubuntu focal-updates/main amd64 qemu-utils amd64 1:4.2-3ubuntu6.21\n
  404  Not Found [IP: 185.125.190.36 80]\n
", "stdout_lines": ["Reading package lists...", "Building dependency tree...", "Reading state information...", "The following packages were automatically installed and are no longer required:", "  golang-1.13 golang-1.13-doc golang-1.13-go golang-1.13-race-detector-runtime", "  golang-1.13-src golang-doc golang-go golang-race-detector-runtime golang-src", "  liblua5.2-0 libnl-genl-3-200 libqt5multimedia5 libqt5multimedia5-plugins", "  libqt5multimediagsttools5 libqt5multimediawidgets5 libqt5opengl5 libsbc1", "  libsmi2ldbl libsnappy1v5 libspandsp2 libspeexdsp1 libssh-gcrypt-4", "  libwireshark-data libwireshark13 libwiretap10 libwsutil11 pkg-config", "  wireshark-common wireshark-qt", "Use 'sudo apt autoremove' to remove them.", "The following additional packages will be installed:", "  acl ipxe-qemu ipxe-qemu-256k-compat-efi-roms libboost-iostreams1.71.0", "  libboost-thread1.71.0 libbrlapi0.7 libcacard0 libclang-common-7-dev", "  libclang1-7 libfdt1 libibverbs1 libiscsi7 libllvm7 libpcsclite1 libpmem1", "  librados2 librbd1 librdmacm1 libslirp0 libspice-server1 libusbredirparser1", "  libuuid1 libvirglrenderer1 llvm-7 llvm-7-runtime qemu-block-extra", "  qemu-system-common qemu-system-data seabios", "Suggested packages:", "  pcscd gstreamer1.0-plugins-ugly samba vde2 debootstrap", "Recommended packages:", "  libomp-7-dev ibverbs-providers gstreamer1.0-plugins-good qemu-system-gui", "  ovmf cpu-checker sharutils", "The following NEW packages will be installed:", "  acl acpica-tools clang-7 ipxe-qemu ipxe-qemu-256k-compat-efi-roms", "  libboost-iostreams1.71.0 libboost-thread1.71.0 libbrlapi0.7 libcacard0", "  libclang-common-7-dev libclang1-7 libfdt1 libibverbs1 libiscsi7 libllvm7", "  libpcsclite1 libpmem1 librados2 librbd1 librdmacm1 libslirp0", "  libspice-server1 libusbredirparser1 libvirglrenderer1 lld-7 llvm-7", "  llvm-7-dev llvm-7-runtime nasm qemu-block-extra qemu-system-common", "  qemu-system-data qemu-system-x86 qemu-utils seabios uuid-dev", "The following packages will be upgraded:", "  libuuid1", "1 upgraded, 36 newly installed, 0 to remove and 103 not upgraded.", "Need to get 14.2 MB/74.9 MB of archives.", "After this operation, 429 MB of additional disk space will be used.", "Err:1 http://archive.ubuntu.com/ubuntu focal-updates/main amd64 librados2 amd64 15.2.14-0ubuntu0.20.04.2", "  404  Not Found [IP: 185.125.190.36 80]", "Err:2 http://archive.ubuntu.com/ubuntu focal-updates/main amd64 librbd1 amd64 15.2.14-0ubuntu0.20.04.2", "  404  Not Found [IP: 185.125.190.36 80]", "Ign:3 http://archive.ubuntu.com/ubuntu focal-updates/main amd64 qemu-block-extra amd64 1:4.2-3ubuntu6.21", "Ign:4 http://archive.ubuntu.com/ubuntu focal-updates/main amd64 qemu-system-common amd64 1:4.2-3ubuntu6.21", "Ign:5 http://archive.ubuntu.com/ubuntu focal-updates/main amd64 qemu-system-data all 1:4.2-3ubuntu6.21", "Ign:6 http://archive.ubuntu.com/ubuntu focal-updates/main amd64 qemu-system-x86 amd64 1:4.2-3ubuntu6.21", "Ign:7 http://archive.ubuntu.com/ubuntu focal-updates/main amd64 qemu-utils amd64 1:4.2-3ubuntu6.21", "Err:3 http://security.ubuntu.com/ubuntu focal-updates/main amd64 qemu-block-extra amd64 1:4.2-3ubuntu6.21", "  404  Not Found [IP: 185.125.190.36 80]", "Err:4 http://security.ubuntu.com/ubuntu focal-updates/main amd64 qemu-system-common amd64 1:4.2-3ubuntu6.21", "  404  Not Found [IP: 185.125.190.36 80]", "Err:5 http://security.ubuntu.com/ubuntu focal-updates/main amd64 qemu-system-data all 1:4.2-3ubuntu6.21", "  404  Not Found [IP: 185.125.190.36 80]", "Err:6 http://security.ubuntu.com/ubuntu focal-updates/main amd64 qemu-system-x86 amd64 1:4.2-3ubuntu6.21", "  404  Not Found [IP: 185.125.190.36 80]", "Err:7 http://security.ubuntu.com/ubuntu focal-updates/main amd64 qemu-utils amd64 1:4.2-3ubuntu6.21", "  404  Not Found [IP: 185.125.190.36 80]"]}

PLAY RECAP *******************************************************************************************************************************************************************************************************************************************************************
localhost                  : ok=1    changed=0    unreachable=0    failed=1    skipped=0    rescued=0    ignored=0
```
