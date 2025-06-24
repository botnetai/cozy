from setuptools import setup, find_packages

setup(
    name="cozy-sdk",
    version="0.0.0",
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    python_requires=">=3.8",
    install_requires=[
        "httpx>=0.24.0",
        "pydantic>=2.0.0",
    ],
    author="Cozy",
    description="Python SDK for Cozy container runtime platform",
    long_description=open("README.md").read(),
    long_description_content_type="text/markdown",
)