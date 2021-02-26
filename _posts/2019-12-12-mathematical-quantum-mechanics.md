---
category: [physics, quantum_mechanics]
date: 2019-12-12 09:24:13
layout: post
tags: [quantum, dirac, hidden]
title: Mathematical Quantum Mechanics
---

## Vector Space

### Vector Space $V$ over $\Complex$

$^\forall u,v,w\in V$ and $\alpha, \beta \in \Complex$

1. $u+v=v+u$
1. $(u+v)+w=u+(v+w)$
1. $^\exist \mathbf{0}$ such that $\mathbf{0}+v=v$
1. $^\exist -v$ such that $v+(-v)=0$
1. $\alpha(\beta v)=(\alpha\beta)v$
1. $(\alpha+\beta)v=\alpha v + \beta v$
1. $\alpha(v+w) = \alpha v + \alpha w$
1. $^\exist \mathbf{1}$ such that $\mathbf{1}\cdot(v)=v$

#### Example

$3$-dimensional vector:

$$\vec{v}=(x,y,z)^T=x\hat{e_1}+y\hat{e_2}+z\hat{e_3}$$

$$\left.\begin{matrix}\hat{e_1}=(1,0,0)^T\\\hat{e_2}=(0,1,0)^T\\\hat{e_3}=(0,0,1)^T\end{matrix}\right\}=\text{standard basis}$$

$n$-dimensional vector:

$$\begin{aligned}\hat{e_k}&=(0,0,\cdots,0,1,0,\cdots,0)^T\\\vec{v}&=\sum_{k=1}^n v_k\hat{e_k}\end{aligned}$$

### Inner Product $V^*\times V\rightarrow\Complex$

> ##### Conjugate Transpose; Hermitian Transpose
>
> $V^\ast=\overline{V^T}=\overline{V}^T$
>
> $V_{ij}^\ast=\overline{V_{ji}}$

1. $\langle\vec{v},\vec{v}\rangle\geq0$ with equality iff $\vec{v}=0$
1. $\langle\vec{v},\vec{w}\rangle=\langle\vec{w},\vec{v}\rangle^\ast$
1. $\langle\alpha\vec{v},\vec{w}\rangle=\alpha^\ast\langle\vec{v},\vec{w}\rangle\\\langle\vec{v},\alpha\vec{w}\rangle=\alpha\langle\vec{v},\vec{w}\rangle$

#### Example

$$\begin{aligned}\vec{v}&=\sum_k v_k\hat{e_k}\\\vec{w}&=\sum_k w_k\hat{e_k}\\\langle\vec{v},\vec{w}\rangle&=\sum_{k,l}v_k^{\ast}w_l\underbrace{\hat{e_k}^\dagger\cdot\hat{e_l}}_{\delta_{k,l}}=\sum_kv_k^{\ast}w_k\end{aligned}$$

$$\begin{aligned}\vec{v}&=\sum_kv_k\hat{e_k}\\\vec{v}^\dagger&=\sum_kv_k^\ast\hat{e_k}^T=(\vec{v}^\ast)^T\\\langle\vec{v},\vec{w}\rangle&=\vec{v}^\dagger\cdot\vec{w}\\\langle\vec{w},\vec{v}\rangle&=\sum_kw_k^\ast v_k=\left(\sum_kv_k^\ast w_k\right)^\ast=\langle\vec{v},\vec{w}\rangle^\ast\end{aligned}$$

### Vector Space and Dirac Notation

Vector Space | Dirac Notation
:---: | :---:
$\vec{v}$ | $\vert v\rangle$
$\vec{v}^\dagger$ | $\langle v \vert$
$\langle v,w\rangle=\langle w,v\rangle^\ast$ | $\langle v\vert w\rangle=\langle w\vert v\rangle^\ast$

$$\begin{aligned}\vert v\rangle=\begin{pmatrix} v_1\\v_2\\\vdots\\v_N\end{pmatrix}&=v_1\begin{pmatrix}1\\0\\\vdots\\0\end{pmatrix}+v_2\begin{pmatrix}0\\1\\\vdots\\0\end{pmatrix}+\cdots+v_N \begin{pmatrix}0\\0\\\vdots\\1\end{pmatrix}\\&=v_1\vert e_1\rangle+v_2\vert e_2\rangle+\cdots+v_N\vert e_N\rangle\\&=\sum_k v_k\vert e_k\rangle=\sum_kv_k\vert k\rangle \end{aligned}$$

$$\langle v\vert w\rangle=\sum_{k,l}v_k^\ast w_l \langle k\vert l\rangle=\sum_kv_k^\ast w_k$$

#### Example

$$\begin{aligned}\vert 0\rangle&=\begin{pmatrix}1\\0\end{pmatrix}, && \vert 1\rangle=\begin{pmatrix}0\\1\end{pmatrix}\\\vert v\rangle&=\alpha\vert 0\rangle+\beta\vert 1\rangle\\\langle v\vert v\rangle&=\vert\alpha\vert^2+\vert\beta\vert^2=1 && \text{(normalization)}\\\implies \alpha&=e^{i\phi_1}\cos{\frac{\theta}{2}}\\\beta&=e^{i\phi_2}\sin{\frac{\theta}{2}}\end{aligned}$$

---

## Function Space

$$\begin{aligned}f(x) : [a,b] &&\rightarrow&&\Complex&: \text{complex-valued function}\\g(x) : [a,b] &&\rightarrow&&\Complex&: \text{complex-valued function}\\\sigma(x) : [a,b] &&\rightarrow&&\R&: \text{weight function}\end{aligned}$$

### Inner Product of Two Functions, $\langle f,g\rangle$

$$\langle f,g\rangle=\int_a^b f^\ast(x)g(x)\sigma(x)dx$$

$$\left\{\phi_n(x)\right\}_{n=1}^{\infin}: \text{basis function}$$

$$f(x)=\sum_{n=1}^{\infin}C_n\phi_n(x)$$

$$\begin{aligned}\langle\phi_j,f\rangle&=\int\phi_j(x)\sum_nC_n\phi_n(x)dx\\&=\sum_nC_n\langle\phi_j,\phi_n\rangle\end{aligned}$$

Suppose that $\langle\phi_j,\phi_n\rangle=N_j\delta_{n,j}$ and $N_j=\langle\phi_j,\phi_j\rangle$,

$$\implies C_j=\frac{1}{N_j}\langle\phi_j,f\rangle=\frac{\langle\phi_j,f\rangle}{\langle\phi_j,\phi_j\rangle}$$

### Generalized Basis Expansion

$f(x)$ is represented by an expansion over basis of orthonormal functions $\left\{\phi_n(x)\right\}_{n=1}^\infin$

$$f(x)=\sum_nC_n\phi_n(x)$$

The coefficients can be determined as

$$C_n=\frac{\langle\phi_n,f\rangle}{\langle\phi_n,\phi_n\rangle}$$

#### Example (Fourier Series)

$$\begin{aligned}f(x)&=\sum_{n=1}^\infin b_n\sin{nx},&&x\in[-\pi,\pi]\\\phi_n(x)&=\sin{nx},&&n=1,2,\cdots,&&x\in[-\pi,\pi]\\\sigma(x)&=1\\\langle\phi_n,\phi_m\rangle&=\int_{-\pi}^\pi\sin{nx}\sin{mx}dx=\pi\delta_{n,m}\\b_n&=\frac{\langle\phi_n,f\rangle}{\langle\phi_n,\phi_n\rangle}=\frac{1}{\pi}\int_{-\pi}^\pi f(x)\sin{nx}dx\end{aligned}$$

---

## Orthogonal Polynomials

$\begin{aligned}f(x)=\sum_nC_nX^n,&&x\in[-1,1], &&\sigma(x)=1\end{aligned}$

### Orthogonalization of $\vec{a_1},\vec{a_2},\vec{a_3}$

$$\begin{aligned}\hat{e_1}=\frac{1}{\lVert\vec{a_1}\rVert},&&\vec{a_1}=\frac{1}{\sqrt{\vec{a_1}\cdot\vec{a_1}}}\vec{a_1}\end{aligned}$$
