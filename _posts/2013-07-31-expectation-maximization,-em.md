---
layout: post
title: Expectation Maximization, EM
date: 2013-07-31 00:00:00
category: [fundamentals, statistics]
tags: [fundamentals, statistics, em]

---

Expectation-Maximization algorithm is used to estimate the underlying probability distribution of (observed) incomplete data. The term “incomplete data” in its general form implies the existence of two sample spaces. The observed data is a realization from a latent space.

## Intuitive Explanation of EM

We want to maximize the posterior probability of the parameters $\Theta$ given the data $X$, marginalizing over $\mathbf{z}$:

$$\Theta^* = \underset {\Theta}{\text{argmax}} \sum_{\mathbf{z} \in \mathbb{Z}^n} p(\Theta,\mathbf{z} | X)$$

- $X$: observed dataset
- $\Theta$: the set of parameters, $\Theta = \{ \Theta_1, \dots, \Theta_K \}$ where $\Theta_k =\{ \theta_1, \dots, \theta_n \}$
- $n$: # of parameters of the distribution (If Gaussian, $n=2$, $\mu$ and $\sigma$.)
- $K$: # of latent variables
- $\mathbf{z}$: latent variables, $\mathbf{z} = \{ 1, \dots, K \}$

> ##### Summary
>- Input: observed data $X$, # of latent variables
>- Output: parameter set $\Theta = \{\Theta_1, \dots, \Theta_K \}$

## Calculation

The following figure represents the calculation of EM algorithm with Gaussian Mixture Model(GMM), assuming that, for example, there are three latent variables(mixture components).

![Calculation in EM procedure]({{ site.baseurl }}/assets/img/e92e5667f5b341c17935fc5eff96249807ff7ed87e1a1f3f094614db93388bab.png)

---

## References

1. [A Gentle Tutorial of the EM Algorithm and its Application to Parameter Estimation for Gaussian Mixture and Hidden Markov Models - Bilmes (1998)]({{ site.baseurl }}/assets/pdf/5df56b9033bf5b3d69b0b14b2ada75db3a777f6142ca42d6a143cf2064cbf3f1.pdf)
2. [The Expectation Maximization Algorithm - Frank Dellaert (2002)]({{ site.baseurl }}/assets/pdf/be8652cb3059bdc81ee9418f9807e8f2360a33b73f5837b74afae18ab80ab91d.pdf)
3. [What is the expectation maximization algorithm - Chuong B Do & Serafim Batzoglou - npg (2008)]({{ site.baseurl }}/assets/pdf/ed594e50ca7e8e193e62f60729091996c500ed7b8bae9e8936ae01ae32143d01.pdf)
4. [Scaling EM (Expectation-Maximization) Clustering to Large Databases - Bradley and Fayyad (1998)]({{ site.baseurl }}/assets/pdf/c0e1263b5ae958131166d00379b5e747e8eec6b9baa9e792f793d4e0c7e3e139.pdf)

## See Also

- [http://en.wikipedia.org/wiki/Expectation_maximization](http://en.wikipedia.org/wiki/Expectation_maximization)
- [http://sens.tistory.com/304](http://sens.tistory.com/304)
