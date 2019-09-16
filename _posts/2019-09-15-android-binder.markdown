---
layout: post
title:  "Memory Management in Android Binder"
date:   2019-09-29 23:10:00 -0800
categories: jekyll update
---
> In the summer of 2017, I interned on the Android kernel team at Google to improve the memory management system of the Android OS. The project was fairly interesting, and the work I did eventually made its way upstream to the Linux kernel. This blog is a short summary of the project.

In fall 2016, I took MIT's operating systems class (6.828)[https://pdos.csail.mit.edu/6.828/]. By the end of the semester, each student built their own OS that consists of a memory management system, a file system, a network driver, as well as other core OS functionalities such as time-sharing. It was a tuff but rewarding class. In the following summer, I joined the Android kernel team as an intern, partially because I liked 6.828, but more so because I thought hacking the OS that has more than 1 billion users is pretty dope.

My project was centered around Android's inter-process communication (IPC) system called (Binder)[https://elinux.org/Android_Binder]. Android runs each app as its own process with private memory for security reasons, and Binder is what allows your apps to communicate (e.g., location sharing via WeChat requires WeChat to talk to Maps). Each communication, also called transaction, involves a certain amount of data to be passed from the source to the target process. But remember, the source process should not be able to directly write to the memory of the target process. Hence, the source process issues a (system call)[https://en.wikipedia.org/wiki/System_call] to Binder, which is a part of the kernel and has privilege, to conduct this transaction. Binder keeps track of processes' memory regions (buffers) using some meta data, which often contains pointers to the next/previous buffers (potentially of a different process) in a linked list. Upon a transaction, Binder uses these meta data to find the appropriate buffer (mmaped)[https://en.wikipedia.org/wiki/Mmap} in the target process and copys the transaction data into that buffer, as shown in the figure below. 

![](/assets/images/20190915/transaction.png)*<center>A Binder transaction from the source to target process.</center>*

In this figure, you may have noticed something concerning: the entire buffer, including the buffer meta data with pointers to other processes' buffers, is mmaped to the target process. An evil target process could follow these meta data and locate other processes' memory buffers! Fortunately, there is still permission protection in place so the evil process cannot corrupt other processes' memory, but being able to read kernel meta data is still considered a pretty serious security concern. I remember asking one of the original authors of Binder about this, and was told that back when Binder was written, read-only access was not a big issue, but we have to be careful now as attackers have got a lot better using even just (side-channel)[https://en.wikipedia.org/wiki/Side-channel_attack] information.

The fix for this issue alone turned out to be very simple---separately allocate meta data onto the kernel heap that is invisible to any userspace processes. 



