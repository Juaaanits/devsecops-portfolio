# Portfolio Website Container

This directory contains the static portfolio website and its Nginx image definition.

Build it from the repository root because the Dockerfile copies this directory from the root build context:

```powershell
docker build -f devsecops-portfolio\Dockerfile -t portfolio-site-secure:local .
```

The complete DevSecOps workflow is documented in the repository [README](../README.md).
