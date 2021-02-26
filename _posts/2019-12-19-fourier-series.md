---
category: mathematics
date: 2019-12-19 14:37:52
layout: post
tags: [fourier, transform, hidden]
title: Fourier Series
---

## Fourier Series

$$f(t)=a_0+\sum_{n=1}^\infin\left\{a_n\cos{(n\omega t)}+b_n\sin{(n\omega t)}\right\}$$

### Finding $a_0$

$$\begin{aligned}\int_0^Tf(t)dt&=\int_0^Ta_0dt+\sum_{n=1}^\infin\int_0^T\left\{a_n\cos{(n\omega t)}+b_n\sin{(n\omega t)}\right\}dt\\&=\int_0^Ta_0dt+0\\&=Ta_0\\\therefore a_0&=\frac{1}{T}\int_0^Tf(t)dt\end{aligned}$$

### Finding $a_n$ and $b_n$

$$\begin{aligned}\int_0^Tf(t)\cos{(n\omega t)}dt&=\int_0^Ta_0\cos{(n\omega t)}dt+\sum_{n=1}^\infin\left\{a_0\int_0^T\cos{(n\omega t)}\cos{(n\omega t)}dt+b_n\int_0^T\sin{(n\omega t)}\cos{(n\omega t)}dt\right\}\\&=0+\sum_{n=1}^\infin\left\{a_n\int_0^T\cos{(n\omega t)}\cos{(n\omega t)}dt+0\right\}\\&=a_n\int_0^T\frac{1+\cos{(2n\omega t)}}{2}dt\\&=a_n\int_0^T\frac{1}{2}dt+0\\&=\frac{T}{2}a_n\\\therefore a_n&=\frac{2}{T}\int_0^Tf(t)\cos{(n\omega t)}dt\\\int_0^Tf(t)\sin{(n\omega t)}dt&=\int_0^Ta_0\sin{(n\omega t)}dt+\sum_{n=1}^\infin\left\{a_0\int_0^T\cos{(n\omega t)}\sin{(n\omega t)}dt+b_n\int_0^T\sin{(n\omega t)}\sin{(n\omega t)}dt\right\}\\&=0+\sum_{n=1}^\infin\left\{0+b_n\int_0^T\sin{(n\omega t)}\sin{(n\omega t)}dt\right\}\\&=b_n\int_0^T\frac{1-\cos{(2n\omega t)}}{2}dt\\&=b_n\int_0^T\frac{1}{2}dt-0\\&=\frac{T}{2}b_n\\\therefore b_n&=\frac{2}{T}\int_0^Tf(t)\sin{(n\omega t)}dt\end{aligned}$$

> ##### Euler's Equation
>
> $$\begin{aligned}e^{in\omega t}&=\cos{(n\omega t)}+i\sin{(n\omega t)}\\e^{-in\omega t}&=\cos{(n\omega t)}-i\sin{(n\omega t)}\end{aligned}$$
> $$\begin{aligned}\cos{(n\omega t)}&=\frac{1}{2}\left(e^{in\omega t}+e^{-in\omega t}\right)\\\sin{(n\omega t)}&=\frac{1}{2i}\left(e^{in\omega t}-e^{-in\omega t}\right)\end{aligned}$$

Fourier series function can be rewritten with Euler's equation:

$$\begin{aligned}f(t)&=a_0+\sum_{n=1}^\infin\left\{a_n\cos{(n\omega t)}+b_n\sin{(n\omega t)}\right\}\\&=a_0+\sum_{n=1}^\infin\left\{\frac{a_n}{2}\left(e^{in\omega t}+e^{-in\omega t}\right)+\frac{b_n}{2i}\left(e^{in\omega t}-e^{-in\omega t}\right)\right\}\\&=a_0+\sum_{n=1}^\infin\left(\frac{a_n-ib_n}{2}\cdot e^{in\omega t}+\frac{a_n+ib_n}{2}\cdot e^{-in\omega t}\right),\\a_0&=\frac{1}{T}\int_0^Tf(t)dt,\\a_n&=\frac{2}{T}\int_0^Tf(t)\cos{(n\omega t)}dt\\&=\frac{1}{T}\int_0^Tf(t)e^{in\omega t}dt+\frac{1}{T}\int_0^Tf(t)e^{-in\omega t}dt,\\ib_n&=i\cdot\frac{2}{T}\int_0^Tf(t)\sin{(n\omega t)}dt\\&=\frac{1}{T}\int_0^Tf(t)e^{in\omega t}dt-\frac{1}{T}\int_0^Tf(t)e^{-in\omega t}dt\end{aligned}$$

Calculate $a_n-ib_n$ and $a_n+ib_n$:

$$\begin{aligned}a_n-ib_n&=\frac{2}{T}\int_0^Tf(t)e^{-in\omega t}dt\\a_n+ib_n&=\frac{2}{T}\int_0^Tf(t)e^{in\omega t}dt\end{aligned}$$

Let $A_n$ and $B_n$ represent:

$$\begin{aligned}A_n&=\frac{1}{T}\int_0^Tf(t)e^{-in\omega t}dt=\frac{a_n-ib_n}{2}\\B_n&=\frac{1}{T}\int_0^Tf(t)e^{in\omega t}dt=\frac{a_n+ib_n}{2}\end{aligned}$$

Then, $A_0$ is as follows:

$$A_0=\frac{1}{T}\int_0^Tf(t)e^{0}dt=a_0$$

Fourier series can be rewritten with $A_n$, $B_n$, and $A_0$:

$$\begin{aligned}f(t)&=a_0+\sum_{n=1}^\infin\left(\frac{a_n-ib_n}{2}e^{in\omega t}+\frac{a_n+ib_n}{2}e^{-in\omega t}\right)\\&=A_0+\sum_{n=1}^\infin\left(A_ne^{in\omega t}+B_ne^{-in\omega t}\right)\\&=\sum_{n=0}^\infin A_ne^{in\omega t}+\sum_{n=1}^\infin B_ne^{-in\omega t}\\&=\sum_{n=0}^\infin A_ne^{in\omega t}+\sum_{n=-1}^{-\infin}B_{(-n)}e^{in\omega t}\\&=\sum_{n=-\infin}^\infin C_ne^{in\omega t},\\C_n&=\left\{\begin{matrix}a_0, & (n=0)\\A_n,&(n>0)\\B_{(-n)}, & (n < 0)\end{matrix}\right.\end{aligned}$$

---

## References

1. [https://spacebike.tistory.com/6](https://spacebike.tistory.com/6)
1. [https://m.blog.naver.com/ggulsatang/221447825893](https://m.blog.naver.com/ggulsatang/221447825893)
